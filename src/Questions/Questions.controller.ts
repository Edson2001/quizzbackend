import { list } from "./Questions.service"


export const listQuestions = async ()=>{

    const response = await list()

    return response

}