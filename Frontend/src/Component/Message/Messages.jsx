import { useEffect, useRef } from "react";
import useGetMessage from "../../Hooks/useGetMessage";
import Message from "./Message";
import MessageSkeleton from "./Skeletons/MessageSkeleton";

const Messages = () => {
	const{loading,message} = useGetMessage()
	console.log("message: ", message)
    const lastMessageRef = useRef();
	useEffect(()=>{
		setTimeout(()=>{
			lastMessageRef.current?.scrollIntoView({behavior:"smooth"});

		},100)

	},[message])


	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading && message.length>0 && message.map((message,index)=>( <div key={message._id || index} ref={lastMessageRef} >
				<Message messages={message}/>
				</div> ) )}
			{loading && [...Array()].map((_,idx)=><MessageSkeleton key={idx} />)}
			{!loading && message.length === 0 && (
				<p className='text-center '>Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;