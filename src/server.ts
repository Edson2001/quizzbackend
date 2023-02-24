import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import game from "./Game"

dotenv.config()

const app = express()

const httpServer = http.Server(app)

const io = new Server(httpServer, { cors: {
    origin: "*",
},})

app.use(cors())

io.on('connection', (socket)=>{
  game({socket, io})
})

httpServer.listen(process.env.ENV_SERVER_PORT || 3030, ()=>console.log('Servidor rodando na porta http://localhost:3030'))