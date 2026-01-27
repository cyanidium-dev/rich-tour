import { randomBytes } from 'crypto'

export function generateUuid() {
    return randomBytes(length)
        .toString("base64url")
        .slice(0, length);
}
