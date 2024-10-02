import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./Authcontext";
import io from 'socket.io-client'
const SocketContext = createContext();

export const useSocketContext =()=>{
    return useContext(SocketContext)
}

export const SocketContextProvider =({children})=>{
    const[socket,setSocket]  = useState(null)
    const[onlineUsers,setonlineUsers] = useState([])
    const {authUser} = useAuthContext();

    useEffect(()=>{
        if(authUser){
            const socket = io("https://chat-app-2-j5fk.onrender.com",{
                query:{
                    userId:authUser._id,
                },
            });
            setSocket(socket);
                console.log(`socketCOntex log1 ${authUser}`)
            socket.on("getOnlineUser",(users)=>{
                console.log(`socketContext log2 ${users}`)
                setonlineUsers(users)
            })

            return ()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[authUser])


    return <SocketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </SocketContext.Provider>
}