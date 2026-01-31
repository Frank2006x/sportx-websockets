import express from 'express'
import matchesRouter from './router/matches.js'
import http from 'http'
import attachedWebSocketServer from './ws/server.js'
import ratelimit, { rateLimit } from 'express-rate-limit'

const generalLimiter=rateLimit({
    windowMs:15*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,
    message:{error:"Too many requests, please try again later."}
})

const app=express()

const PORT=(process.env.PORT)||3000
const HOST=process.env.HOST || '0.0.0.0'

app.use(express.json())
const server=http.createServer(app)

app.get("/",(req,res)=>{
    res.send({"message":"welcome"})
})
app.use(generalLimiter)

app.use("/matches",matchesRouter)

const {broadCastMatchCreated}=attachedWebSocketServer(server)
app.locals.broadCastMatchCreated=broadCastMatchCreated

server.listen(PORT,HOST,()=>{
    const baseUrl=(HOST==='0.0.0.0') ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
    console.log(`server started at ${baseUrl}`)
    console.log(`WebSocket server available at ${baseUrl.replace("http","ws")}/ws`)
})