import { createHash } from "crypto"

export async function fileHash(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer())

    return createHash('sha256').update(buffer).digest('hex')
}