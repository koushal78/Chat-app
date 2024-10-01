import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import {app, server} from './socket/socket.js'
dotenv.config();
import authRoutes from './Routes/auth.route.js';
import authmessage from './Routes/message.route.js';
import userRoute from './Routes/user.route.js';
import path from 'path'
import connectdb from './Connection/db.js';

const Port = process.env.PORT || 5000
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRoutes);
app.use('/api/message',authmessage);
app.use('/api/user',userRoute);

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,resp)=>{
    resp.sendFile(path.join(__dirname,"/frontend/dist/index.html"))
})

app.get('/',(req,resp)=>{
    resp.send("hello world")
})

server.listen(Port,()=>{
    connectdb();
     
    console.log(`server is running on ${Port}  port`)}) 