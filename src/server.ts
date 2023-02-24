import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import questions from "./questions"
import dotenv from "dotenv"
import { createUser, removeUser } from "./User/User.controller"
dotenv.config()


const app = express()

const httpServer = http.Server(app)

const io = new Server(httpServer, { cors: {
    origin: "*",
},})

app.use(cors())

const users = []

const game = {
    gameCountQuestion: 1,
    currentQuestionPostion: 0,
    totalQuestion: questions.length,
    currentQuestion: questions[0],
    selectedQuestion: null,
    users:[]
}

io.on('connection', (socket)=>{
    
    socket.on('setUser', (user)=>{

        user.id = socket.id
        
        const userExist = users.find(item=> item.name === user.name)
        if(userExist){
            userExist.id = socket.id
            console.log('user', userExist)
        }else{
            user.name = user.name
            console.log(createUser({name: user.name, uuid: user.id}))
            users.push(user)
            
        }
        
        console.log('Novo usuario no jogo '+socket.id)
        game.users = users
        io.emit('sendState', game)
    })

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
                console.log(await removeUser(userOut.id))
                game.users.splice(i, 1)
                
                io.emit('sendState', game)
                    
                    
            }

        }
    })
})

httpServer.listen(process.env.ENV_SERVER_PORT || 3030, ()=>console.log('Servidor rodando na porta http://localhost:3030'))