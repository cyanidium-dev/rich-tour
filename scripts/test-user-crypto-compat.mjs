import {randomBytes} from 'node:crypto'
import assert from 'node:assert/strict'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
process.env.USER_DATA_MASTER_KEY = randomBytes(32).toString('base64')

const {decryptPayload, encryptPayload} = await import('./lib/user-crypto.mjs')
const documentId = 'agent.crypto-compatibility-test'
const documentType = 'agentUser'
const testPayload = {
  email: 'test@example.invalid',
  password: {plain: 'not-a-real-password', hash: 'test-hash'},
}

const fromBase64 = (value) =>
  Uint8Array.from(Buffer.from(value, 'base64'))
const toBase64 = (value) => Buffer.from(value).toString('base64')
const masterKey = fromBase64(process.env.USER_DATA_MASTER_KEY)
const importedKey = await crypto.subtle.importKey('raw', masterKey, 'HKDF', false, [
  'deriveKey',
])
const webKey = await crypto.subtle.deriveKey(
  {
    name: 'HKDF',
    hash: 'SHA-256',
    salt: encoder.encode('rich-tour/users-production/v1'),
    info: encoder.encode('payload-encryption'),
  },
  importedKey,
  {name: 'AES-GCM', length: 256},
  false,
  ['encrypt', 'decrypt'],
)
const aad = encoder.encode(`rich-tour-user:1:${documentId}:${documentType}`)

const nodeEnvelope = encryptPayload(documentId, documentType, testPayload)
const nodeCiphertext = fromBase64(nodeEnvelope.ciphertext)
const nodeTag = fromBase64(nodeEnvelope.tag)
const combined = new Uint8Array(nodeCiphertext.length + nodeTag.length)
combined.set(nodeCiphertext)
combined.set(nodeTag, nodeCiphertext.length)
const webDecrypted = JSON.parse(
  decoder.decode(
    await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: fromBase64(nodeEnvelope.iv),
        additionalData: aad,
        tagLength: 128,
      },
      webKey,
      combined,
    ),
  ),
)
assert.deepEqual(webDecrypted, testPayload)

const webIv = crypto.getRandomValues(new Uint8Array(12))
const webResult = new Uint8Array(
  await crypto.subtle.encrypt(
    {name: 'AES-GCM', iv: webIv, additionalData: aad, tagLength: 128},
    webKey,
    encoder.encode(JSON.stringify(testPayload)),
  ),
)
const tagOffset = webResult.length - 16
const webEnvelope = {
  _type: 'encryptedUserPayload',
  version: 1,
  iv: toBase64(webIv),
  ciphertext: toBase64(webResult.slice(0, tagOffset)),
  tag: toBase64(webResult.slice(tagOffset)),
}
assert.deepEqual(decryptPayload(documentId, documentType, webEnvelope), testPayload)

await assert.rejects(async () => {
  const damaged = {...nodeEnvelope, ciphertext: `${nodeEnvelope.ciphertext.slice(0, -2)}AA`}
  decryptPayload(documentId, documentType, damaged)
})

console.log('Node Crypto and Web Crypto payload formats are compatible.')
