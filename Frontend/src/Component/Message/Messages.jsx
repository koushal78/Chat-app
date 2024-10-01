import { useEffect, useRef } from "react";
import useGetMessage from "../../Hooks/useGetMessage";
import Message from "./Message";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import useListenMessages from "../../Hooks/UseListenMessages";

const Messages = () => {
	const{loading,messages} = useGetMessage()
	useListenMessages()
	console.log("message: ", messages)
    const lastMessageRef = useRef();
	useEffect(()=>{
		setTimeout(()=>{
			lastMessageRef.current?.scrollIntoView({behavior:"smooth"});

		},100)

	},[messages])


	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading && messages.length>0 && messages.map((message,index)=>( <div key={message._id || index} ref={lastMessageRef} >
				<Message messages={message}/>
				</div> ) )}
			{loading && [...Array()].map((_,idx)=><MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center '>Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;