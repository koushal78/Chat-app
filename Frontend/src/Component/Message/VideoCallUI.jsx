import { PhoneOff, Mic, Video } from "lucide-react";

const VideoCallUI = ({ localVideoRef, remoteVideoRef, onHangup }) => {
  return (
    <div className="relative w-full h-full bg-black">
      {/* Remote video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute bottom-4 right-4 w-40 rounded-lg border"
      />

      <button
        onClick={onHangup}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 p-4 rounded-full"
      >
        <PhoneOff />
      </button>
    </div>
  );
};

export default VideoCallUI;
