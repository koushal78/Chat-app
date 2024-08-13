import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        length:6
    },
    gender:{
        type:String,
        require:true,
       enum:['male',"female"],
    },
    Profilepic:{
        type:String,
        default:"",
    }
//   To add a timestamp to your schema in Mongoose, you can use the timestamps option. When you set timestamps: true, Mongoose automatically adds two fields, createdAt and updatedAt, to your schema. These fields will store the creation and last update timestamps of each document.

},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User