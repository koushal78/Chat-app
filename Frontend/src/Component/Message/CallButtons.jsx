import React from "react";

const CallButtons = ({ onAccept, onDecline }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAccept}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
      >
        Answer
      </button>

      <button
        onClick={onDecline}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Decline
      </button>
    </div>
  );
};

export default CallButtons;
