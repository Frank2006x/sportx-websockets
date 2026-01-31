import WebSocket, { WebSocketServer } from "ws"


function sendJson(socket,payload){
    if(socket.readyState!==WebSocket.OPEN) return

    socket.send(JSON.stringify(payload))
}

function broadCast(wss,payload){

    for (const client of wss.clients){
        if(client.readyState!==WebSocket.OPEN) continue;
        sendJson(client,payload)
    }
}

export default function attachedWebSocketServer(server){
    const wss=new WebSocketServer({server,path:"/ws",maxPayload:1024*1024});

    wss.on("connection",(socket,req)=>{
        socket.isAlive=true;
        socket.on("pong",()=>{
            socket.isAlive=true;
        })

        sendJson(socket,{type:"welcome"})
        socket.on("error",(err)=>{
            console.error("WebSocket error:",err);
        })
    })
    const interval=setInterval(()=>{
        wss.clients.forEach((socket)=>{
            if(socket.isAlive===false){
                socket.terminate();
                return;
            }
            socket.isAlive=false;
            socket.ping();
        })
    },30000)

    wss.on("error",(err)=>{
        console.error("WebSocket server error:",err)
    })

    function broadCastMatchCreated(match){
        broadCast(wss,{type:"match_created",data:match})
    }
    return {broadCastMatchCreated}
}