import {createClient} from '@sanity/client'
import {decryptPayload} from './lib/user-crypto.mjs'

const USER_TYPES = ['agentUser', 'agencyUser']
const APPLY_FLAGS = ['--apply', '--confirm-delete-source-users']
const projectId = process.env.SANITY_PROJECT_ID
const sourceDataset = process.env.SANITY_DATASET || 'production'
const targetDataset = process.env.SANITY_USERS_DATASET || 'users-production'
const token = process.env.SANITY_API_TOKEN
const shouldApply = APPLY_FLAGS.every((flag) => process.argv.includes(flag))

if (!projectId || !token || sourceDataset === targetDataset) {
  throw new Error('Check Sanity configuration and ensure source and target datasets differ')
}

const options = {
  projectId,
  apiVersion: process.env.SANITY_API_VERSION || '2025-04-26',
  token,
  useCdn: false,
  perspective: 'raw',
}
const sourceClient = createClient({...options, dataset: sourceDataset})
const targetClient = createClient({...options, dataset: targetDataset})
const sourceDocuments = await sourceClient.fetch(
  '*[_type in $types]{_id, _type}',
  {types: USER_TYPES},
)
const targetDocuments = await targetClient.fetch(
  '*[_type in $types]{_id, _type, encryptedPayload}',
  {types: USER_TYPES},
)
const targetById = new Map(targetDocuments.map((document) => [document._id, document]))

let missingOrUnreadable = 0
for (const sourceDocument of sourceDocuments) {
  const target = targetById.get(sourceDocument._id)
  if (!target || target._type !== sourceDocument._type) {
    missingOrUnreadable += 1
    continue
  }
  try {
    decryptPayload(target._id, target._type, target.encryptedPayload)
  } catch {
    missingOrUnreadable += 1
  }
}

console.log(
  JSON.stringify(
    {
      mode: shouldApply ? 'apply' : 'plan',
      sourceDataset,
      targetDataset,
      sourceUserDocuments: sourceDocuments.length,
      verifiedEncryptedTargets: sourceDocuments.length - missingOrUnreadable,
      missingOrUnreadableTargets: missingOrUnreadable,
    },
    null,
    2,
  ),
)

if (missingOrUnreadable > 0) {
  throw new Error('Cleanup blocked: not every source user has a readable encrypted target')
}
if (!shouldApply) {
  console.log('Plan only. No documents were deleted.')
  process.exit(0)
}

for (let offset = 0; offset < sourceDocuments.length; offset += 100) {
  const transaction = sourceClient.transaction()
  for (const document of sourceDocuments.slice(offset, offset + 100)) {
    transaction.delete(document._id)
  }
  await transaction.commit()
}
console.log(`Deleted ${sourceDocuments.length} source user documents after target verification.`)
