import express from 'express'
import matchesRouter from './router/matches.js'

const app=express()

const port=8000
app.use(express.json())

app.get("/",(req,res)=>{
    res.send({"message":"welcome"})
})

app.use("/matches",matchesRouter)


app.listen(port,()=>{
    console.log("server started...")
})