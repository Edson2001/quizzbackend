import {PrismaClient} from "@prisma/client"
import User from "./User.type"

const prisma = new PrismaClient()

export const create = async ({name, uuid}: User)=>{

    const result =  await prisma.user.create({
        data:{
            name: name,
            userID: uuid
        }
    })
    
    return result
}

export const deleteUser = async (userID: string)=>{

    const result = await prisma.user.delete({
        where: {
            userID: userID
        }
    })
    return result 
}