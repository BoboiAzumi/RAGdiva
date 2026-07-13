import * as bcrypt from "bcrypt"

export function hashPassword(password: string): string {
    const hash = bcrypt.hashSync(password, 10)

    return hash
}

export function comparePassword(password: string, encryptedPassword: string): boolean {
    const result = bcrypt.compareSync(password, encryptedPassword)

    return result
}