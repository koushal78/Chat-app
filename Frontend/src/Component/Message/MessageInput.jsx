import { useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../Hooks/useSendMessage";
import { Paperclip, SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const {  sendMessage } = useSendMessage();
  const [showEmoji, setShowEmoji] = useState(false);
 const[Uploading,setUploading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
    
    if (!message.trim() && !file) return;

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 10) {
        toast.error("File size must be under 10MB");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/message/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      fileUrl = data.url;
      fileName = data.name;
      fileType = data.type;
    }

    await sendMessage({ message, fileUrl, fileType, fileName });
    setMessage("");
    setFile(null);
      
    } catch (error) {
      toast.error(error?.message);
      
    }
    finally{

      setUploading(false)
    }
  };

  return (
    <div className="relative">

      {/* ===== PREVIEW CONTAINER (FLOATING & TRANSPARENT) ===== */}
      {file && (
        <div className="absolute bottom-20 left-4 z-40 flex gap-2 bg-transparent">

          {/* IMAGE */}
          {file.type.startsWith("image") && (
            <div className="relative inline-block p-1 rounded-xl border border-white/20 bg-transparent">
              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-sm"
              >
                ✕
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg"
              />
              <p className="text-xs text-gray-300 text-center mt-1 truncate w-40">
                {file.name}
              </p>
            </div>
          )}

          {/* VIDEO */}
          {file.type.startsWith("video") && (
            <div className="relative inline-block p-1 rounded-xl border border-white/20 bg-transparent">
              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-sm"
              >
                ✕
              </button>
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-48 rounded-lg"
              />
              <p className="text-xs text-gray-300 text-center mt-1 truncate w-48">
                {file.name}
              </p>
            </div>
          )}

          {/* AUDIO */}
          {file.type.startsWith("audio") && (
            <div className="relative inline-block p-2 rounded-xl border border-white/20 bg-transparent">
              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-sm"
              >
                ✕
              </button>
              <audio
                src={URL.createObjectURL(file)}
                controls
                className="w-48"
              />
              <p className="text-xs text-gray-300 text-center mt-1 truncate w-48">
                {file.name}
              </p>
            </div>
          )}

          {/* OTHER FILES (PDF, DOC, etc.) */}
          {!file.type.startsWith("image") &&
            !file.type.startsWith("video") &&
            !file.type.startsWith("audio") && (
              <div className="relative inline-flex items-center gap-3 p-3 rounded-xl border border-white/20 bg-transparent">
                <button
                  onClick={() => setFile(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-sm"
                >
                  ✕
                </button>
                <img src="/pdf.png" alt="file" className="w-6 h-6" />
                <span className="text-sm text-white truncate max-w-[160px]">
                  {file.name}
                </span>
              </div>
            )}
        </div>
      )}

      {/* ===== EMOJI PICKER ===== */}
      {showEmoji && (
        <div className="absolute bottom-16 left-4 z-50">
          <EmojiPicker
            theme="dark"
            onEmojiClick={(emoji) =>
              setMessage((prev) => prev + emoji.emoji)
            }
          />
        </div>
      )}

      {/* ===== INPUT BAR ===== */}
      <form
        onSubmit={handleSubmit}
        className="w-full px-4 py-3 border-t border-white/10"
      >
        <div className="flex items-center gap-3 bg-transparent border border-white/10 rounded-full px-4 py-2">

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-gray-400 hover:text-violet-400"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="button"
            onClick={() => setShowEmoji((prev) => !prev)}
            className="text-gray-400 hover:text-violet-400"
          >
            <SmilePlus size={20} />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={() => setShowEmoji(false)}
          />

          <button
            type="submit"
            disabled={Uploading}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60"
          >
            {Uploading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <BsSend className="text-white text-sm" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
