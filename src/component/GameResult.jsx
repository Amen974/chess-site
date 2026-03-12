import React from "react";

const GameResult = ({gameResult}) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center fixed z-10 backdrop-blur-xs bg-slate-900/90 shadow-2xl text-white">
      <div className="bg-[#101622] h-[60%] w-[90%] md:w-120 rounded-2xl shadow-2xl ">
        <div className="h-[13%] border-b border-gray-800 flex items-center gap-2 p-6 text-gray-400 font-medium text-sm">
          <img src="SVG/trophy.svg" alt="trophy" />
          <p>GAME SUMMARY</p>
        </div>

        <div className="h-[77%] flex flex-col items-center p-7 gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold"> {gameResult.result === "draw" ? "Draw!" : `${gameResult.winner} Wins!`}</h1>
            <p className="text-blue-700 font-medium">BY {gameResult.reason}</p>
          </div>

          <div className="flex gap-6 items-center mb-3">
            <img
              src={null}
              alt=""
              width={60}
              height={60}
              className="bg-gray-800 rounded-4xl"
            />
            <p className="font-bold text-xl">VS</p>
            <img
              src={null}
              alt=""
              width={60}
              height={60}
              className="bg-gray-800 rounded-4xl"
            />
          </div>

          <button className="bg-blue-700 w-full p-3 rounded-xl cursor-pointer font-medium flex justify-center gap-0.5">
            <img src="SVG/restart.svg" alt="restart" />
            REMATCH
          </button>
        </div>

        <div className="h-[10%] border-t border-gray-800"></div>
      </div>
    </div>
  );
};

export default GameResult;
