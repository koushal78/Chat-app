export const createPeerConnection = (socket, receiverId) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("audio:ice", {
        to: receiverId,
        candidate: event.candidate,
      });
    }
  };

  return pc;
};
