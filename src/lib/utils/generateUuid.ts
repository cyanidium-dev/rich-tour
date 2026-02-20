import { randomBytes } from 'crypto'

export function generateUuid(length: number = 16) {
    return randomBytes(Math.ceil(length * 0.75))
        .toString("base64url")
        .slice(0, length);
}
