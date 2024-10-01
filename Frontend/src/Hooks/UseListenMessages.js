import { useEffect } from "react"
import {useSocketContext} from '../Context/SocketContext'
import useConversaton from '../Zustand/getConversation'
import notificationSound from '../assets/sounds/sound_1.mp3'
const useListenMessages = ()=>{
    const {socket} = useSocketContext()
    const {messages,setmessage} = useConversaton()

    useEffect(()=>{
        socket?.on("newMessage",(newMessage)=>{
            newMessage.shouldShake = true
            const sound = new Audio(notificationSound)
            sound.play()
            setmessage([...messages,newMessage])
        })
        return ()=> socket?.off("newMessage")
    },[socket,setmessage,messages])
}
export default useListenMessages