import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createPeerConnection } from "../webRTC/audioCall";

const useAudioCall = (socket, selectedConversation, onIncomingCall) => {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const ringtoneRef = useRef(null);
  const audioElementsRef = useRef([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [callStatus, setCallStatus] = useState("idle");
  // idle | ringing | connected
  const [callType, setCallType] = useState("audio");

  /* ---------- INIT RINGTONE ---------- */
  useEffect(() => {
    ringtoneRef.current = new Audio("/ringtone.mp3");
    ringtoneRef.current.loop = true;
  }, []);

  /* ---------- HELPERS ---------- */
  const stopRingtone = () => {
    if (!ringtoneRef.current) return;
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
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

  // ✅ Clean up audio elements
  audioElementsRef.current.forEach(audio => {
    audio.pause();
    audio.srcObject = null;
    audio.remove();
  });
  audioElementsRef.current = [];

  if (localVideoRef.current) localVideoRef.current.srcObject = null;
  if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
};
  /* ---------- SAFE REMOTE STREAM ATTACH ---------- */
  const attachRemoteStreamSafely = (stream) => {
    const wait = setInterval(() => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        clearInterval(wait);
      }
    }, 100);
  };

  /* ---------- START CALL (CALLER) ---------- */
  const startCall = async (type = "audio") => {
    try {
      setCallType(type);
      setCallStatus("ringing");

      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });

      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      pcRef.current = createPeerConnection(socket, selectedConversation._id);

      pcRef.current.ontrack = (event) => {
        if (type === "video") {
          attachRemoteStreamSafely(event.streams[0]);
        } else {
          const audio = document.createElement("audio");
          audio.srcObject = event.streams[0];
          audio.autoplay = true;
          audio.playsInline = true;
          audio.play().catch(() => {});
          document.body.appendChild(audio);
          audioElementsRef.current.push(audio); 
        }
      };

      localStreamRef.current.getTracks().forEach(track =>
        pcRef.current.addTrack(track, localStreamRef.current)
      );

      socket.emit("audio:call", {
        to: selectedConversation._id,
        type,
      });

    } catch {
      toast.error("Media permission denied");
      cleanupCall();
    }
  };

  /* ---------- ACCEPT CALL (RECEIVER) ---------- */
  const acceptCall = async (from, type = "audio") => {
    try {
      stopRingtone();
      setCallType(type);
      setCallStatus("connected");

      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });

      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }

      pcRef.current = createPeerConnection(socket, from);

      pcRef.current.ontrack = (event) => {
        if (type === "video") {
          attachRemoteStreamSafely(event.streams[0]);
        } else {
          const audio = document.createElement("audio");
          audio.srcObject = event.streams[0];
          audio.autoplay = true;
          audio.playsInline = true;
          audio.play().catch(() => {});
          document.body.appendChild(audio);
           audioElementsRef.current.push(audio);
        }
      };

      localStreamRef.current.getTracks().forEach(track =>
        pcRef.current.addTrack(track, localStreamRef.current)
      );

      socket.emit("audio:accept", { to: from });

    } catch {
      toast.error("Media permission denied");
      cleanupCall();
    }
  };

  /* ---------- DECLINE CALL ---------- */
  const declineCall = (from) => {
    stopRingtone();
    socket.emit("audio:end", { to: from });
  };

  /* ---------- SIGNALING ---------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("audio:accepted", async () => {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("audio:offer", {
        to: selectedConversation._id,
        offer,
      });
    });

    socket.on("audio:offer", async ({ from, offer }) => {
      await pcRef.current.setRemoteDescription(offer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("audio:answer", { to: from, answer });
    });

    socket.on("audio:answer", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
      setCallStatus("connected");
    });

    socket.on("audio:ice", async ({ candidate }) => {
      if (candidate && pcRef.current) {
        await pcRef.current.addIceCandidate(candidate);
      }
    });

    socket.on("audio:end", () => {
      cleanupCall();
      toast.error("Call ended");
    });

    return () => {
      socket.off("audio:accepted");
      socket.off("audio:offer");
      socket.off("audio:answer");
      socket.off("audio:ice");
      socket.off("audio:end");
    };
  }, [socket, selectedConversation]);

  /* ---------- INCOMING CALL ---------- */
  useEffect(() => {
    if (!socket || !onIncomingCall) return;

    const onIncoming = ({ from, type = "audio" }) => {
      setCallType(type);
      setCallStatus("ringing");

      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current.play().catch(() => {});

      onIncomingCall(from, acceptCall, declineCall, stopRingtone, type);
    };

    socket.on("audio:incoming", onIncoming);
    return () => socket.off("audio:incoming", onIncoming);
  }, [socket, onIncomingCall]);

  /* ---------- CLEANUP ON CHAT CHANGE ---------- */
  useEffect(() => {
    return cleanupCall;
  }, [selectedConversation]);

  return {
    callStatus,
    callType,
    startCall,
    cleanupCall,
    localVideoRef,
    remoteVideoRef,
  };
};

export default useAudioCall;
