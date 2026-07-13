import { HTTPException } from "hono/http-exception";
import { findUserById, findUserByUsername } from "../repositories/user-repo.js";
import { comparePassword } from "../utils/bcrypt.js";
import { jwtSign, jwtVerify } from "../utils/jsonwebtoken.js";
import type { JwtPayload } from "jsonwebtoken";

export async function authenticate(username: string, password: string) {
    const user = await findUserByUsername(username)

    if (!user){
        throw new HTTPException(404, { message: "user not found" })
    }

    if (!comparePassword(password, user.password)) {
        throw new HTTPException(403, { message: "wrong password" })
    }

    const token = jwtSign({ 
        id: user.id
    })

    return token
}

export async function verifyToken(token: string) {
    try {
        const payload = jwtVerify(token) as JwtPayload

        const user = findUserById(payload.id)

        if(!user) {
            throw new HTTPException(403, { message: "invalid credential" })
        }

        return user
    }
    catch (e) {
        throw new HTTPException(403, { message: "invalid credential" })
    }
}