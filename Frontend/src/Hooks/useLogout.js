import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../Context/Authcontext";



const useLogout=()=>{
    const[loading,setLoading] = useState(false);
    const {setauthUser} = useAuthContext()

    const logout = async()=>{
        setLoading(true)
       try {
        const data = await fetch("/api/auth/logout",{
            method:'Post',
            headers:{"content-type":"application/json"}
        })
        const result = await data.json();
        localStorage.removeItem("chat-user")
        
        setauthUser(null)
       } catch (error) {
        toast.error(error.message)
        
       }
       finally{
        setLoading(false)
       }
    }
    return {loading,logout};
}

export default useLogout;