import {createClient} from '@sanity/client'
import {randomInt} from 'node:crypto'
import bcrypt from 'bcryptjs'
import {
  decryptPayload,
  encryptPayload,
  getIdentityLookup,
  normalizeIdentity,
} from './lib/user-crypto.mjs'

const USER_TYPES = ['agentUser', 'agencyUser']
const APPLY_FLAGS = [
  '--apply',
  '--confirm-copy-users',
  '--confirm-reset-missing-passwords',
]
const projectId = process.env.SANITY_PROJECT_ID
const sourceDataset = process.env.SANITY_DATASET || 'production'
const targetDataset = process.env.SANITY_USERS_DATASET || 'users-production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-04-26'
const token = process.env.SANITY_API_TOKEN
const resetMissingPasswords = process.argv.includes('--reset-missing-plain')
const shouldApply = APPLY_FLAGS.every((flag) => process.argv.includes(flag))

if (!projectId || !targetDataset || !token) {
  throw new Error(
    'SANITY_PROJECT_ID, SANITY_USERS_DATASET and SANITY_API_TOKEN are required',
  )
}
if (sourceDataset === targetDataset) {
  throw new Error('Source and target Sanity datasets must be different')
}

const clientOptions = {
  projectId,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
}
const sourceClient = createClient({...clientOptions, dataset: sourceDataset})
const targetClient = createClient({...clientOptions, dataset: targetDataset})
const compact = (value) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined))

function generateTemporaryPassword(length = 20) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*-_'
  return Array.from({length}, () => alphabet[randomInt(alphabet.length)]).join('')
}

async function getPassword(document, targetPayload) {
  const plain = document.password?.plain
  if (typeof plain !== 'string' || !plain) {
    if (!resetMissingPasswords) return null
    if (targetPayload?.password?.plain && targetPayload?.password?.hash) {
      return {password: targetPayload.password, wasReset: true}
    }
    const temporaryPassword = generateTemporaryPassword()
    return {
      password: {
        plain: temporaryPassword,
        hash: await bcrypt.hash(temporaryPassword, 10),
      },
      wasReset: true,
    }
  }
  const existingHash = document.password?.hash ?? document.passwordHash
  const hash =
    typeof existingHash === 'string' && existingHash ? existingHash : await bcrypt.hash(plain, 10)
  return {password: {plain, hash}, wasReset: false}
}

function getInvalidSourceFlags(document) {
  const identity = document._type === 'agentUser' ? document.email : document.login
  return {
    missingIdentity: typeof identity !== 'string' || !identity.trim(),
    missingPlainPassword:
      typeof document.password?.plain !== 'string' || !document.password.plain,
    missingPasswordHash:
      typeof (document.password?.hash ?? document.passwordHash) !== 'string' ||
      !(document.password?.hash ?? document.passwordHash),
  }
}

async function toPayload(document, targetPayload) {
  const passwordResult = await getPassword(document, targetPayload)
  if (!passwordResult) return null
  const {password, wasReset} = passwordResult

  if (document._type === 'agentUser') {
    if (typeof document.email !== 'string' || !document.email.trim()) return null
    return compact({
      email: normalizeIdentity(document.email),
      companyName: document.companyName,
      legalCompanyName: document.legalCompanyName,
      phone: document.phone,
      edrpou: document.edrpou,
      city: document.city,
      site: document.site,
      taxForm: document.taxForm,
      agencyCrmId: document.agencyCrmId,
      crmId: document.crmId,
      crmLastErrorMessage: document.crmSync?.lastErrorMessage,
      password,
      passwordResetRequired: wasReset || targetPayload?.passwordResetRequired || undefined,
    })
  }

  if (typeof document.login !== 'string' || !document.login.trim()) return null
  return compact({
    legalAgencyName: document.legalAgencyName,
    marketingAgencyName: document.marketingAgencyName,
    login: normalizeIdentity(document.login),
    agencyEdrpou: document.agencyEdrpou,
    agencyCity: document.agencyCity,
    agencyLegalAddress: document.agencyLegalAddress,
    agencyEmail: document.agencyEmail,
    agencyPhone: document.agencyPhone,
    mainOfficeEmail: document.mainOfficeEmail,
    password,
    passwordResetRequired: wasReset || targetPayload?.passwordResetRequired || undefined,
  })
}

function toEncryptedDocument(document, payload) {
  const identity = document._type === 'agentUser' ? payload.email : payload.login
  const encrypted = {
    _id: document._id,
    _type: document._type,
    identityLookup: getIdentityLookup(identity),
    encryptedPayload: encryptPayload(document._id, document._type, payload),
  }

  if (document._type === 'agentUser') {
    encrypted.isApproved = document.isApproved ?? false
    if (document.agency) encrypted.agency = document.agency
    encrypted.crmLinked = Boolean(payload.crmId)
    if (document.crmSync) encrypted.crmSync = getPublicCrmSync(document.crmSync)
  }
  return encrypted
}

function getPublicCrmSync(crmSync) {
  if (!crmSync) return undefined
  const {lastErrorMessage: _encryptedMessage, ...publicCrmSync} = crmSync
  return publicCrmSync
}

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  )
}
const same = (left, right) =>
  JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right))

function logicalDocument(document, payload) {
  return {
    payload,
    isApproved: document._type === 'agentUser' ? document.isApproved ?? false : undefined,
    agency: document._type === 'agentUser' ? document.agency : undefined,
    crmLinked: document._type === 'agentUser' ? Boolean(payload.crmId) : undefined,
    crmSync:
      document._type === 'agentUser' ? getPublicCrmSync(document.crmSync) : undefined,
  }
}

let sourceDocuments
let targetDocuments
try {
  sourceDocuments = await sourceClient.fetch('*[_type in $types] | order(_id asc)', {
    types: USER_TYPES,
  })
  targetDocuments = await targetClient.fetch('*[_type in $types] | order(_id asc)', {
    types: USER_TYPES,
  })
} catch {
  throw new Error(
    'Could not read the Sanity datasets. Check network access, dataset existence and token permissions.',
  )
}

const targetById = new Map(targetDocuments.map((document) => [document._id, document]))
const missing = []
let unchanged = 0
let conflicts = 0
let invalidSource = 0
const invalidSourceReasons = {
  missingIdentity: 0,
  missingPlainPassword: 0,
  missingPasswordHash: 0,
}

for (const sourceDocument of sourceDocuments) {
  const invalidFlags = getInvalidSourceFlags(sourceDocument)
  for (const reason of Object.keys(invalidSourceReasons)) {
    if (invalidFlags[reason]) invalidSourceReasons[reason] += 1
  }
  const targetDocument = targetById.get(sourceDocument._id)
  let existingTargetPayload
  if (targetDocument) {
    try {
      existingTargetPayload = decryptPayload(
        targetDocument._id,
        targetDocument._type,
        targetDocument.encryptedPayload,
      )
    } catch {
      conflicts += 1
      continue
    }
  }

  const payload = await toPayload(sourceDocument, existingTargetPayload)
  if (!payload) {
    invalidSource += 1
    continue
  }

  if (!targetDocument) {
    missing.push(toEncryptedDocument(sourceDocument, payload))
    continue
  }

  try {
    if (same(logicalDocument(sourceDocument, payload), logicalDocument(targetDocument, existingTargetPayload))) {
      unchanged += 1
    } else {
      conflicts += 1
    }
  } catch {
    conflicts += 1
  }
}

const sourceIds = new Set(sourceDocuments.map((document) => document._id))
console.log(
  JSON.stringify(
    {
      mode: shouldApply ? 'apply' : 'plan',
      sourceDataset,
      targetDataset,
      sourceDocuments: sourceDocuments.length,
      readyToCreate: missing.length,
      unchangedInTarget: unchanged,
      invalidSourceDocuments: invalidSource,
      invalidSourceReasons,
      passwordsToReset: resetMissingPasswords
        ? invalidSourceReasons.missingPlainPassword
        : 0,
      passwordHashesToRegenerate: invalidSourceReasons.missingPasswordHash,
      conflicts,
      targetOnlyDocuments: targetDocuments.filter((document) => !sourceIds.has(document._id)).length,
    },
    null,
    2,
  ),
)

if (invalidSource > 0 || conflicts > 0) {
  throw new Error(
    'Migration stopped: resolve invalid password records and target conflicts before applying.',
  )
}
if (!shouldApply) {
  console.log('Plan only. No documents were written.')
  process.exit(0)
}

try {
  for (let offset = 0; offset < missing.length; offset += 50) {
    const transaction = targetClient.transaction()
    for (const document of missing.slice(offset, offset + 50)) {
      transaction.createIfNotExists(document)
    }
    await transaction.commit()
  }
} catch {
  throw new Error('Migration write failed. Source documents were not modified.')
}
console.log(`Created ${missing.length} encrypted user documents. Source data was not changed.`)
