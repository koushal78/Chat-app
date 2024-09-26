import Conversation from "../Model/conservationmodel.js";
import Message from "../Model/massagemodel.js";

export const sendMessage = async (req, res) => {
	try {
		const  {message}  = req.body;
		let { id: receiverId } = req.params;
		let senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.message.push(newMessage._id);
		}  
		// console.log("senderId:", senderId);
		// console.log("receiverId:", receiverId);
		
		//  await conversation.save();
		// await newMessage.save();


		
		// this will run in parallel

		await Promise.all([conversation.save(),newMessage.save()])

		// console.log("Saved conversation with message:", conversation);

	
		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


export const getMessage = async (req,res)=>{
	try {

		const {id:userToChatId} = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants:{$all:[senderId,userToChatId]},
		}).populate("message")

		if(!conversation){
			return res.status(200).json([])
		}
		
		const message = conversation.message;

		res.status(200).json(message);
	} catch (error) {
		console.log("Error in getMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}
