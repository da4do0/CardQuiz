import React from "react";

const WaitingPlayers = () => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">👥</div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Waiting for participants...
      </h3>
      <p className="text-white/70">
        Share the quiz link with others to get started!
      </p>
    </div>
  );
};

export default WaitingPlayers;
