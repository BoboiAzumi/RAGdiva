import "dotenv/config"
import { hashPassword } from "./utils/bcrypt.js";
import { prisma } from "./utils/database.js";

async function setupAdmin(){
    const defaultAdminUsername = 'admin'

    const user = await prisma.users.findFirst({
        where: {
            username: defaultAdminUsername
        }
    })

    if (user) {
        await prisma.users.update({
            data: {
                password: hashPassword(`${defaultAdminUsername}123`)
            },
            where: {
                username: defaultAdminUsername
            }
        })

        console.log('Admin updated !!!')
        return
    }

    await prisma.users.create({
        data: {
            username: defaultAdminUsername,
            password: hashPassword(`${defaultAdminUsername}123`),
            fullName: defaultAdminUsername,
            majorId: null
        }
    })

    console.log('Admin created !!!')

    return
}

await setupAdmin()
console.log("Press ctrl + c to exited")