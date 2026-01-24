import mongoose from "mongoose";

const massagemodel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true

    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true

    },
    message:{
        type:String,
        require:true
    },
    fileUrl:{
        type:String,

    },
    fileType:{
        type:String,

    },
    fileName:{
        type:String

    }
},{timestamps:true})

const Message = mongoose.model("Message",massagemodel);
export default Message;