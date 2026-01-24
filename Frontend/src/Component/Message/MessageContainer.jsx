import { TiMessage } from "react-icons/ti";
import { ArrowLeft, PhoneOutgoing, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useConversation from "../../Zustand/getConversation";
import { useAuthContext } from "../../Context/Authcontext";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import toast from "react-hot-toast";
import { createPeerConnection } from "../../webRTC/audioCall";
import { useSocketContext } from "../../Context/SocketContext";
import CallButtons from "./CallButtons";
import AudioCallUI from "./AudioCallUI";

/* ---------- No Chat Selected ---------- */
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

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const ringtoneRef = useRef(null);

  const [callStatus, setCallStatus] = useState("idle");
  // idle | ringing | connected

  /* ---------- INIT RINGTONE ---------- */
  useEffect(() => {
    ringtoneRef.current = new Audio("/ringtone.mp3");
    ringtoneRef.current.loop = true;
  }, []);

  useEffect(() => {
    return () => setselectedConversation(null);
  }, [setselectedConversation]);

  /* ---------- START AUDIO CALL (CALLER) ---------- */
  const startAudioCall = async () => {
    try {
      setCallStatus("ringing")
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      pcRef.current = createPeerConnection(
        socket,
        selectedConversation._id
      );

      pcRef.current.ontrack = (event) => {
        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        audio.playsInline = true;
        audio.play().catch(() => {});
        document.body.appendChild(audio);
      };

      localStreamRef.current.getTracks().forEach(track =>
        pcRef.current.addTrack(track, localStreamRef.current)
      );

      socket.emit("audio:call", { to: selectedConversation._id });
    } catch {
      toast.error("Microphone access denied");
    }
  };

  /* ---------- ACCEPT AUDIO CALL (RECEIVER) ---------- */
  const acceptAudioCall = async (callerId) => {
    
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    pcRef.current = createPeerConnection(socket, callerId);

    pcRef.current.ontrack = (event) => {
      const audio = document.createElement("audio");
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      audio.playsInline = true;
      audio.play().catch(() => {});
      document.body.appendChild(audio);
    };

    localStreamRef.current.getTracks().forEach(track =>
      pcRef.current.addTrack(track, localStreamRef.current)
    );

    socket.emit("audio:accept", { to: callerId });
    setCallStatus("connected"); // ✅ FIX
  };

  /* ---------- CALLER RECEIVES ACCEPT → SEND OFFER ---------- */
  useEffect(() => {
    if (!socket) return;

    const onAccepted = async () => {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("audio:offer", {
        to: selectedConversation._id,
        offer,
      });
    };

    socket.on("audio:accepted", onAccepted);
    return () => socket.off("audio:accepted", onAccepted);
  }, [socket, selectedConversation]);

  /* ---------- RECEIVER RECEIVES OFFER → SEND ANSWER ---------- */
  useEffect(() => {
    if (!socket) return;

    const onOffer = async ({ from, offer }) => {
      await pcRef.current.setRemoteDescription(offer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("audio:answer", { to: from, answer });
    };

    socket.on("audio:offer", onOffer);
    return () => socket.off("audio:offer", onOffer);
  }, [socket]);

  /* ---------- CALLER RECEIVES ANSWER ---------- */
  useEffect(() => {
    if (!socket) return;

    const onAnswer = async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
      setCallStatus("connected"); // ✅ FIX
    };

    socket.on("audio:answer", onAnswer);
    return () => socket.off("audio:answer", onAnswer);
  }, [socket]);

  /* ---------- ICE CANDIDATES ---------- */
  useEffect(() => {
    if (!socket) return;

    const onIce = async ({ candidate }) => {
      if (candidate && pcRef.current) {
        await pcRef.current.addIceCandidate(candidate);
      }
    };

    socket.on("audio:ice", onIce);
    return () => socket.off("audio:ice", onIce);
  }, [socket]);

  /* ---------- CALL ENDED ---------- */
  useEffect(() => {
    if (!socket) return;

    const onEnd = () => {
      cleanupCall();
      toast.error("Call ended");
    };

    socket.on("audio:end", onEnd);
    return () => socket.off("audio:end", onEnd);
  }, [socket]);

  /* ---------- INCOMING CALL ---------- */
  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({ from }) => {
      

      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current.play().catch(() => {});

      toast(
        (t) => (
          <div className="flex gap-3 items-center">
            <span>Incoming Audio Call</span>
            <CallButtons
              onAccept={() => {
                stopRingtone();
                acceptAudioCall(from);
                toast.dismiss(t.id);
              }}
              onDecline={() => {
                stopRingtone();
                socket.emit("audio:end", { to: from });
                toast.dismiss(t.id);
              }}
            />
          </div>
        ),
        { duration: Infinity }
      );
    };

    socket.on("audio:incoming", onIncoming);
    return () => socket.off("audio:incoming", onIncoming);
  }, [socket]);

  /* ---------- HELPERS ---------- */
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const cleanupCall = () => {
    stopRingtone();
    setCallStatus("idle");

    if (pcRef.current) {
      pcRef.current.getSenders().forEach(s => s.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
  };

  useEffect(() => cleanupCall, [selectedConversation]);

  if (!selectedConversation) return <NochatSelected />;

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Header */}
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
          <PhoneOutgoing size={20} onClick={startAudioCall} />
          <Video />
        </div>
      </div>

      {/* MAIN CONTENT */}
      { (callStatus === "ringing" ||  callStatus === "connected") && (
        <div className="flex-1 mx-auto absolute z-40  w-full h-full flex justify-center items-center">
          <AudioCallUI
            onHangup={() => {
              socket.emit("audio:end", {
                to: selectedConversation._id,
              });
              cleanupCall();
            }}
          />
        </div>
      ) 
    }
          <Messages />
          <MessageInput />
    </div>
  );
};

export default MessageContainer;
