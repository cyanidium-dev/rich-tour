import {createClient} from '@sanity/client'
import bcrypt from 'bcryptjs'
import {decryptPayload, getIdentityLookup} from './lib/user-crypto.mjs'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_USERS_DATASET || 'users-production'
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) {
  throw new Error('SANITY_PROJECT_ID and SANITY_API_TOKEN are required')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || '2025-04-26',
  token,
  useCdn: false,
  perspective: 'raw',
})
let documents
try {
  documents = await client.fetch('*[_type in ["agentUser", "agencyUser"]]')
} catch {
  throw new Error('Sanity user dataset audit could not fetch documents; check connection and credentials.')
}
const forbiddenOpenFields = [
  'email',
  'login',
  'password',
  'passwordHash',
  'phone',
  'companyName',
  'legalCompanyName',
  'edrpou',
  'city',
  'site',
  'taxForm',
  'agencyCrmId',
  'crmId',
  'legalAgencyName',
  'marketingAgencyName',
  'agencyEdrpou',
  'agencyCity',
  'agencyLegalAddress',
  'agencyEmail',
  'agencyPhone',
  'mainOfficeEmail',
]

const report = {
  dataset,
  totalDocuments: documents.length,
  agentDocuments: 0,
  agencyDocuments: 0,
  readableEncryptedPayloads: 0,
  unreadableEncryptedPayloads: 0,
  invalidIdentityLookups: 0,
  missingPasswordPairs: 0,
  invalidBcryptFormats: 0,
  temporaryPasswords: 0,
  temporaryPasswordHashMismatches: 0,
  documentsWithOpenSensitiveFields: 0,
  documentsWithOpenCrmErrorMessage: 0,
}

for (const document of documents) {
  if (document._type === 'agentUser') report.agentDocuments += 1
  if (document._type === 'agencyUser') report.agencyDocuments += 1
  if (forbiddenOpenFields.some((field) => document[field] !== undefined)) {
    report.documentsWithOpenSensitiveFields += 1
  }
  if (document.crmSync?.lastErrorMessage !== undefined) {
    report.documentsWithOpenCrmErrorMessage += 1
  }

  try {
    const payload = decryptPayload(document._id, document._type, document.encryptedPayload)
    report.readableEncryptedPayloads += 1
    const identity = document._type === 'agentUser' ? payload.email : payload.login
    if (
      typeof identity !== 'string' ||
      document.identityLookup !== getIdentityLookup(identity)
    ) {
      report.invalidIdentityLookups += 1
    }
    if (!payload.password?.plain || !payload.password?.hash) {
      report.missingPasswordPairs += 1
    } else if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(payload.password.hash)) {
      report.invalidBcryptFormats += 1
    }
    if (payload.passwordResetRequired) {
      report.temporaryPasswords += 1
      if (!(await bcrypt.compare(payload.password.plain, payload.password.hash))) {
        report.temporaryPasswordHashMismatches += 1
      }
    }
  } catch {
    report.unreadableEncryptedPayloads += 1
  }
}

console.log(JSON.stringify(report, null, 2))

const failed =
  report.totalDocuments === 0 ||
  report.unreadableEncryptedPayloads > 0 ||
  report.invalidIdentityLookups > 0 ||
  report.missingPasswordPairs > 0 ||
  report.invalidBcryptFormats > 0 ||
  report.temporaryPasswordHashMismatches > 0 ||
  report.documentsWithOpenSensitiveFields > 0 ||
  report.documentsWithOpenCrmErrorMessage > 0

if (failed) throw new Error('Encrypted user dataset audit failed')
console.log('Encrypted user dataset audit passed without exposing user data.')
