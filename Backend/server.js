import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
import authRoutes from './Routes/auth.route.js';
import authmessage from './Routes/message.route.js';
import userRoute from './Routes/user.route.js';

import connectdb from './Connection/db.js';

const Port = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRoutes);
app.use('/api/message',authmessage);
app.use('/api/user',userRoute);

app.get('/',(req,resp)=>{
    resp.send("hello world")
})

app.listen(Port,()=>{
    connectdb();
     
    console.log(`server is running on ${Port}  port`)}) 