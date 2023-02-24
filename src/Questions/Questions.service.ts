import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()


export const list = async ()=>{

    const result = await prisma.questions.findMany()

    return result

}
