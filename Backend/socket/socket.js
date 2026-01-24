import {Server} from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:[
            'http://localhost:3000',
            "https://chat-app-eg97.onrender.com"
        ],
        methods:["GET",'POST'],
        credentials: true,
    },
}
);
export const getReceiverSocketId = (receiverId)=>{
    return userSocketMap[receiverId]
}
 const userSocketMap={};


io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);
const userId = socket.handshake.query.userId;
if(userId!= undefined) userSocketMap[userId] = socket.id

socket.on("audio:call",({to})=>{
    const receverSocketId = userSocketMap[to];
    if(receverSocketId){
        io.to(receverSocketId).emit("audio:incoming",{
            from:userId,
        })
    }
})

socket.on("audio:accept",({to})=>{
    const callerSocketId = userSocketMap[to];
    if(callerSocketId){
        io.to(callerSocketId).emit("audio:accepted");
    }
})
socket.on("audio:offer", ({ to, offer }) => {
  const receiverSocketId = userSocketMap[to];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("audio:offer", {
      from: userId,
      offer
    });
  }
});

socket.on("audio:answer",({to,answer})=>{
    io.to(userSocketMap[to]).emit("audio:answer",{
        from:userId,
        answer
    });
})

socket.on("audio:ice",({to,candidate})=>{
    io.to(userSocketMap[to]).emit("audio:ice",{
        from:userId,
        candidate
    });
})

socket.on("audio:end",({to})=>{
    io.to(userSocketMap[to]).emit("audio.end",{
        from:userId
    });
})

io.emit("getOnlineUser",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        if(userSocketMap[userId] === socket.id){

            delete userSocketMap[userId];
        }
        io.emit("getOnlineUser",Object.keys(userSocketMap))

    })
})


export {app,io,server}