import express from "express";

import http from "http"

import {Server} from "socket.io"
import cors from "cors"
import questions from "./questions.js";
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
        }else{
            user.name = user.name
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
        //vencedor
       

    })

    socket.on('nextQuestion', (userName)=>{

        if(game.currentQuestionPostion < game.totalQuestion){

            if(game.selectedQuestion && game.selectedQuestion == game.currentQuestion.rightoption){

                //toast.success('Boa! continua assim.')
                console.log("fBoa! continua assimo")

                const currentUser = game.users.find(user=> user.name === userName)

                if(currentUser){
                    currentUser.score += 5
                    currentUser.totalQuestionsCorret += 1
                }
                //socket.emit("setScore", {name: userName, score: 5, totalQuestionsCorret: 1})
                console.log(game.users)

            }else{
                //toast.error('Resposta errada, pode tentar denovo no final do jogo .')
                console.log("Resposta errada,")
            }

            game.currentQuestionPostion += 1
            
            let newQuestionPosition = game.currentQuestionPostion
           
            if(game.currentQuestionPostion == game.totalQuestion){
                //toast.success('fim do jogo') 
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

    socket.on('disconnect', () => {

        console.log('user disconnected');
        
        for(let i = 0; i < game.users.length; i++){

            if(game.users[i].id === socket.id){

                console.log('Usuario '+game.users[i].name+ " Saiu do jogo")
                
                io.emit("userOut", game.users[i].name)

                game.users.splice(i, 1)

                io.emit('sendState', game)
                    
                    
            }

        }
        

    })

})

httpServer.listen(3030, ()=>console.log('Servidor rodando na porta 3030'))