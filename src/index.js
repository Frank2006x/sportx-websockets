import express from 'express'
import matchesRouter from './router/matches.js'
import http from 'http'
import attachedWebSocketServer from './ws/server.js'
const app=express()

const PORT=(process.env.PORT)||3000
const HOST=process.env.HOST || '0.0.0.0'

app.use(express.json())
const server=http.createServer(app)

app.get("/",(req,res)=>{
    res.send({"message":"welcome"})
})

app.use("/matches",matchesRouter)

const {broadCastMatchCreated}=attachedWebSocketServer(server)
app.locals.broadCastMatchCreated=broadCastMatchCreated

server.listen(PORT,HOST,()=>{
    const baseUrl=(HOST==='0.0.0.0') ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
    console.log(`server started at ${baseUrl}`)
    console.log(`WebSocket server available at ${baseUrl.replace("http","ws")}/ws`)
})