import jwt from "jsonwebtoken"

export function jwtSign(obj: object){
    return jwt.sign(
        obj as object, 
        process.env.JWT_PRIVATE_KEY as string, 
        { algorithm: "HS256", expiresIn: '24h' }
    )
}

export function jwtVerify(token: string){
    return jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY as string,
        { algorithms: ["HS256"] }
    )
}