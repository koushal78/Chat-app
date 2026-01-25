import { TiMessage } from "react-icons/ti";
import { ArrowLeft, PhoneOutgoing, Video } from "lucide-react";
import { useEffect, useCallback } from "react";
import useConversation from "../../Zustand/getConversation";
import { useAuthContext } from "../../Context/Authcontext";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { useSocketContext } from "../../Context/SocketContext";
import AudioCallUI from "./AudioCallUI";
import VideoCallUI from "./VideoCallUI";
import useAudioCall from "../../Hooks/useAudioCall";
import toast from "react-hot-toast";
import CallButtons from "./CallButtons";

/* ---------- NO CHAT ---------- */
const NochatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName}</p>
        <p>Select a chat to start messaging</p>
        <TiMessage className="text-3xl md:text-6xl" />
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const { selectedConversation, setselectedConversation } = useConversation();
  const { socket } = useSocketContext();

  /* ---------- INCOMING CALL TOAST ---------- */
  const handleIncomingCall = useCallback(
    (from, acceptCall, declineCall, stopRingtone, type) => {
      toast(
        (t) => (
          <div className="flex gap-3 items-center">
            <span>
              Incoming {type === "video" ? "Video" : "Audio"} Call
            </span>

            <CallButtons
              onAccept={() => {
                stopRingtone();
                acceptCall(from, type);
                toast.dismiss(t.id);
              }}
              onDecline={() => {
                stopRingtone();
                declineCall(from);
                toast.dismiss(t.id);
              }}
            />
          </div>
        ),
        { duration: Infinity }
      );
    },
    []
  );

  /* ---------- CALL HOOK ---------- */
  const {
    callStatus,
    callType,
    startCall,
    cleanupCall,
    localVideoRef,
    remoteVideoRef,
  } = useAudioCall(socket, selectedConversation, handleIncomingCall);

  useEffect(() => {
    return () => setselectedConversation(null);
  }, [setselectedConversation]);

  if (!selectedConversation) return <NochatSelected />;

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* ---------- HEADER ---------- */}
      <div className="bg-blue-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="md:hidden text-white cursor-pointer"
            onClick={() => setselectedConversation(null)}
          />
          <span className="text-white font-bold">
            {selectedConversation.fullName}
          </span>
        </div>

        <div className="text-white flex gap-4">
          <PhoneOutgoing
            size={20}
            onClick={() => startCall("audio")}
            className="cursor-pointer"
          />
          <Video
            size={20}
            onClick={() => startCall("video")}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* ---------- CALL OVERLAY ---------- */}
      {(callStatus === "ringing" || callStatus === "connected") && (
        <div className="absolute inset-0 z-40 bg-black/60 flex justify-center items-center">
          {callType === "audio" ? (
            <AudioCallUI
              callStatus={callStatus}
              onHangup={() => {
                socket.emit("audio:end", {
                  to: selectedConversation._id,
                });
                cleanupCall();
              }}
            />
          ) : (
            <VideoCallUI
              localVideoRef={localVideoRef}
              remoteVideoRef={remoteVideoRef}
              onHangup={() => {
                socket.emit("audio:end", {
                  to: selectedConversation._id,
                });
                cleanupCall();
              }}
            />
          )}
        </div>
      )}

      {/* ---------- CHAT ---------- */}
      <Messages />
      <MessageInput />
    </div>
  );
};

export default MessageContainer;
