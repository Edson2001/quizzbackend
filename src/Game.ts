
import { Socket, Server } from "socket.io"
import { listQuestions } from "./Questions/Questions.controller"
export default async  function game({socket, io}: {socket: Socket, io: Server}){
    
    const questions = await listQuestions()
    console.log(questions)
    
    const game = {
        gameCountQuestion: 1,
        currentQuestionPostion: 0,
        totalQuestion: questions.length,
        //currentQuestion: questions[0] ?? [],
        currentQuestion: questions[0] ?? [],
        selectedQuestion: null,
        users:[]
    }
    const users = []
    socket.on('setUser', (user)=>{

        user.id = socket.id
        
        const userExist = users.find(item=> item.name === user.name)
        if(userExist){
            userExist.id = socket.id
            console.log('user', userExist)
        }else{
            user.name = user.name
            users.push(user)
            
        }
        
        console.log('Novo usuario no jogo '+socket.id)
        game.users = users
        
        io.emit('sendState', game)
    })
    console.log(game, 'game')
    socket.emit('sendState', game)

    socket.on('selectedQuestion', (selected)=>{

        game.selectedQuestion = selected
        console.log('resposta selecionada: ' +game.selectedQuestion)

    })

    socket.on('endGame', ()=>{

        if(game.users){

            const winner = game.users.reduce((prev, current)=>{
                return prev.score > current.score ? prev : current
            })
            console.log(winner)
        }
    })

    socket.on('nextQuestion', (userName)=>{

        if(game.currentQuestionPostion < game.totalQuestion){

            if(game.selectedQuestion && game.selectedQuestion == game.currentQuestion.rightoption){
                console.log("fBoa! continua assimo")

                const currentUser = game.users.find(user=> user.name === userName)

                if(currentUser){
                    currentUser.score += 5
                    currentUser.totalQuestionsCorret += 1
                }
                console.log(game.users)

            }else{
                console.log("Resposta errada")
            }

            game.currentQuestionPostion += 1
            
            let newQuestionPosition = game.currentQuestionPostion
           
            if(game.currentQuestionPostion == game.totalQuestion){
                console.log("fim de jogo")
                return
            }

            game.currentQuestion = questions[newQuestionPosition]
            
            game.gameCountQuestion++

            io.emit('sendState', game)
        }

    })


    socket.on("initGame", (time)=>{

        io.emit("startTime", time)
        
    })

    socket.on('disconnect', async () => {

        console.log('user disconnected');
        
        for(let i = 0; i < game.users.length; i++){
            const userOut =  game.users[i]
            if(userOut.id === socket.id){

                console.log('Usuario '+userOut.name+ " Saiu do jogo")
                
                io.emit("userOut", userOut.name)
                
                game.users.splice(i, 1)
                
                io.emit('sendState', game)
                    
                    
            }

        }
    })

}