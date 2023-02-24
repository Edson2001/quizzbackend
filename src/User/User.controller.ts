
import { create, deleteUser } from "./User.service"
import User from "./User.type"

export const createUser = async ({name, uuid}: User)=>{
    
    if(!name){
        return {
            status: "error",
            message: "invalid name"
        }
    }

    const response =  await create({name, uuid})
    console.log(response)
    return response
}

export const removeUser = async (userID: string)=>{

    if(userID){

        const response = await deleteUser(userID)
        return response
    }

}