import { PhoneOff, Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";

const AudioCallUI = ({ onHangup }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-[400px] bg-black text-white rounded-lg">
      <p className="text-lg">Audio Call</p>
      <p className="text-2xl mt-2">{formatTime(seconds)}</p>

      <div className="flex gap-6 mt-6">
        <button className="bg-gray-700 p-4 rounded-full">
          <Mic />
        </button>

        <button
          onClick={onHangup}
          className="bg-red-600 p-4 rounded-full"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default AudioCallUI;
