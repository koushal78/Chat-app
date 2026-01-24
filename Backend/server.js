import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import {app, server} from './socket/socket.js'
import authRoutes from './Routes/auth.route.js';
import authmessage from './Routes/message.route.js';
import userRoute from './Routes/user.route.js';
import connectdb from './Connection/db.js';
import cors from "cors";

const Port = process.env.PORT || 5000
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: [
    "http://localhost:3000",
     "https://chat-app-eg97.onrender.com"
  ],
  credentials: true
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



app.use('/api/auth',authRoutes);
app.use('/api/message',authmessage);
app.use('/api/user',userRoute);

app.use(express.static(path.join(__dirname,"/Frontend/dist")))
app.get("*",(req,resp)=>{
    resp.sendFile(path.join(__dirname,"Frontend","dist","index.html"))
})

app.get('/',(req,resp)=>{
    resp.send("hello world")
})

server.listen(Port,()=>{
    connectdb();
     
    console.log(`server is running on ${Port}  port`)}) 