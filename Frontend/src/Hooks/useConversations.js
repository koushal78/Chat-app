import { useEffect, useState } from "react"
import toast from "react-hot-toast";


const useConversations =()=>{
    const[loading,setloading] = useState(false);
    const[conversations,setconversations] = useState([]);
    useEffect(()=>{
        const getconversations =async()=>{
            setloading(true);
            try {
                const res =  await fetch("/api/user");
            const data =  await res.json();
            if(data.error){
                throw new error(data.error);
            }
            // console.log(data)
            setconversations(data)
            } catch (error) {
                toast.error(error.message)
                
            }
            finally{
                setloading(false)
            }
        }
        getconversations();
    },[])
    return {loading,conversations}
}
export default useConversations;