import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../Context/Authcontext";

const uselogin=()=>{
    const[loading,setloading] = useState(false);
    const {setauthUser} = useAuthContext();
    
    const login=async(username,password)=>{
        const sucess = handlesucess(username,password)
        if(!sucess) return;
        setloading(true);
        try {
            const res =  await fetch("/api/auth/login",{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({username,password})
                
            })
            const data =  await res.json();
            if(data.error){
                throw new Error(data.error);
            }
            localStorage.setItem('chat-user',JSON.stringify(data))
            setauthUser(data)
        } catch (error) {
            toast.error(error.message)
            
        }
        finally{
            setloading(false)
        }

    }
    return {loading,login}
}
export default uselogin;

const handlesucess =(username,password)=>{
    if(!username || !password ){
    toast.error("please fill all field ")
    return false;

    }
    return true;

}