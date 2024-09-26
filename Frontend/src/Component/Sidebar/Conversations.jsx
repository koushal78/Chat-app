import useConversaton from "../../Hooks/useConversations"
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation"


function Conversations() {
  const{loading,conversations}=useConversaton()
  // console.log("Conversation:" ,conversations);
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation,idx)=>(
        <Conversation
        key={conversation._id}
        conversation={conversation}
        emoji = {getRandomEmoji()}
        lastIdx ={idx === conversations.length-1}
        />
      ))}
       {loading ? <span className="loading loading-spinner mx-auto"></span>: null}


    </div>
  )
}

export default Conversations