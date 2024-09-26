import useConversaton from "../../Zustand/getConversation"


function Conversation({conversation,emoji,lastIdx}) {
  const{selectedConversation,setselectedConversation} = useConversaton();
  const isSelected = selectedConversation?._id === conversation._id
  return (
    <>
   <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 sursor-pointer ${isSelected ? 'bg-sky-500':''}`}
   onClick={()=>setselectedConversation(conversation)}
   
   >
   <div className="avatar online">
  <div className="w-12 rounded-full">
    <img src={conversation.Profilepic}/>
  </div>
</div>
<div className="flex flex-col flex-1">
    <div className="flex gap-3 justify-between">
        <p className="font-bold text-gray-200">{conversation.fullName}</p>
        <span className="text-xl">{emoji}</span>
    </div>
</div>
    </div> 
    {!lastIdx && <div className="divider my- py-0 h-1"></div>}
    
    </>
  )
}

export default Conversation