import useConversaton from "../../Zustand/getConversation";
import { useAuthContext } from '../../Context/Authcontext'
import { extractTime } from "../../utils/extractTime";


const Message = ({ messages }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversaton();
  const fromMe = messages.senderId === authUser._id;
  const formattedTime = extractTime(messages.createdAt)
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.Profilepic : selectedConversation?.Profilepic;
  console.log(selectedConversation)
  console.log(authUser)
  const bubbleColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = messages.shouldShake ? "shake" : ""

  console.log("this is the message ", messages)

  return (
    <div className={`chat ${chatClassName}`} >
      <div className="chat-image avatar ">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={`${profilePic} &background=random&color=fff`} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleColor} ${shakeClass}  ${messages.fileUrl?" bg-black/10":""}`}>
        
        {


        messages.fileUrl && messages.fileType?.startsWith("image") && (
          <div>
            <img
              src={messages.fileUrl}
              alt={messages.fileName}
              className="w-28 h-28 rounded-md bg-black/10"
              onClick={() => window.open(messages.fileUrl, "_blank")}
            />
            <a
              href={messages.fileUrl}
              download={messages.fileName}
              className="text-xs text-blue-400 text-center"
            >
              Download
            </a>


          </div>
        )}
        {/* audio */}


        {


        messages.fileUrl && messages.fileType?.startsWith("audio") && (
          <div>
            <audio
              src={messages.fileUrl}
              controls
              className="w-28 h-28 rounded-md "
              onClick={() => window.open(messages.fileUrl, "_blank")}
            />
            <a
              href={messages.fileUrl}
              download={messages.fileName}
              className="text-xs text-blue-400 text-center"
            >
              Download
            </a>


          </div>
        )}

        {/* video */}
        {


        messages.fileUrl && messages.fileType?.startsWith("video") && (
          <div>
            <video
              src={messages.fileUrl}
              controls
              className="w-28 h-28 rounded-md "
              onClick={() => window.open(messages.fileUrl, "_blank")}
            />
            <a
              href={messages.fileUrl}
              download={messages.fileName}
              className="text-xs text-blue-400 text-center"
            >
              Download
            </a>


          </div>
        )}

        {
          messages.fileUrl && !messages.fileType.startsWith("image") && !messages.fileType?.startsWith("video") && !messages.fileType?.startsWith("audio")  && (
            <a
              href={messages.fileUrl}
              download={messages.fileName}
              //   target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 bg-black/30 rounded-lg mb-1"
            >
              <img src="/pdf.png" alt="pdf" className="w-6 h-6" />
              <span className="text-sm truncate max-w-[150px]">
                {messages.fileName}
              </span>
            </a>
          )
        }

        {messages.message && (
          <p>{messages.message}</p>
        )}

        


      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center '>{formattedTime}</div>
    </div>


  )
}

export default Message