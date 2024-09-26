import useConversaton from "../../Zustand/getConversation";
import {useAuthContext} from '../../Context/Authcontext'
import { extractTime } from "../../utils/extractTime";


const  Message = ({messages}) => {
  const{authUser} = useAuthContext();
  const{selectedConversation} = useConversaton();
  const fromMe = messages.senderId === authUser._id;
  const formattedTime = extractTime(messages.createdAt)
  const chatClassName = fromMe ? 'chat-end':'chat-start';
  const profilePic = fromMe ? authUser.Profilepic : selectedConversation?.Profilepic;
  const bubbleColor = fromMe ? "bg-blue-500" : "";  

  return (
    <div className={`chat ${chatClassName}`} >
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
            <img
        alt="Tailwind CSS chat bubble component"
        src={profilePic} />
    </div> 
            </div>
            <div className={`chat-bubble text-white ${bubbleColor}`}>{messages.message}</div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center '>{formattedTime}</div>
        </div>
        
   
  )
}
 
export default Message