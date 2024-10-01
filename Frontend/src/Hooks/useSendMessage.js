import { useState } from "react"
import useConversaton from "../Zustand/getConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
const[loading,setloading] = useState(false);
const{messages,setmessage,selectedConversation}= useConversaton()
const sendMessage =async(message)=>{
    setloading(true)
    try {
        const res = await fetch(`/api/message/send/${selectedConversation._id}`,{
            method:'POST',
            headers:{
                'content-Type':'application/json',
            },
            body:JSON.stringify({message}),
            
        })  
        const data  = await res.json();
        if(data.error){
            throw new Error(data.error)
        }
        setmessage([...messages,data])
        console.warn([...messages,JSON.stringify(data)])
    } catch (error) {
        toast.error(error.message)
        
    }
    finally{
        setloading(false)
    }
}
return {loading,sendMessage}
}

export default useSendMessage