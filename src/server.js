import express from "express";

import http from "http"

import {Server} from "socket.io"
import cors from "cors"

const app = express()

const httpServer = http.Server(app)

const io = new Server(httpServer, { cors: {
    origin: "*",
},})

app.use(cors())

const users = []

io.on('connection', (socket)=>{
    
    socket.on('setUser', (user)=>{

        user.id = socket.id
        
        const userExist = users.find(item=> item.name === user.name)
        
        if(userExist){
            userExist.id = socket.id
        }else{
            //users[socket.id] = user
            user.name = user.name
            users.push(user)
        }
        
        console.log('Novo usuario no jogo '+socket.id)
        io.emit("setUser", users)
    })

    socket.on("setScore", (userScore)=>{

        users.forEach(user=>{

            if(user.name === userScore.name){

                user.score += userScore.score

                user.totalQuestionsCorret += userScore.totalQuestionsCorret

                io.emit("setUser", users)

            }

        })

    })

    socket.on("initGame", (time)=>{

        io.emit("startTime", time)
        
    })

    socket.on('disconnect', () => {

        console.log('user disconnected');
        
        for(let i = 0; i < users.length; i++){

            if(users[i].id === socket.id){

                console.log('Usuario '+users[i].name+ " Saiu do jogo")
                
                io.emit("userOut", users[i].name)

                users.splice(i, 1)
               
                io.emit("setUser", users)    
                    
            }

        }
        

    })

})

httpServer.listen(3030, ()=>console.log('Servidor rodando na porta 3030'))