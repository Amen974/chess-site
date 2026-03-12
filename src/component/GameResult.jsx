import React from "react";

const GameResult = ({ gameResult, handelReset, handelClose }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center fixed z-10 backdrop-blur-xs bg-slate-900/90 shadow-2xl text-white">
      <div className="bg-[#101622] h-[60%] w-[90%] sm:w-120 md:w-120 rounded-2xl shadow-2xl ">
        <div className="h-[13%] border-b border-gray-800 flex items-center gap-2 p-6 text-gray-400 font-medium text-sm relative">
          <img src="SVG/trophy.svg" alt="trophy" />
          <p>GAME SUMMARY</p>
          <button onClick={handelClose} className="cursor-pointer absolute right-5">
            <img src="SVG/close.svg" alt="close" width={20} height={20} />
          </button>
        </div>

        <div className="h-[77%] flex flex-col items-center p-7 gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">
              {" "}
              {gameResult.result === "draw"
                ? "Draw!"
                : `${gameResult.winner} Wins!`}
            </h1>
            <p className="text-blue-700 font-medium">BY {gameResult.reason}</p>
          </div>

          <div className="flex gap-6 items-center mb-3">
            <img
              src="SVG/human.svg"
              alt="human"
              width={50}
              height={50}
              className="bg-gray-800 rounded-4xl"
            />

            <p className="font-bold text-xl text-gray-400">VS</p>
            <img
              src="SVG/ai.svg"
              alt="ai"
              width={50}
              height={50}
              className="bg-gray-800 rounded-4xl"
            />
          </div>

          <button
            onClick={handelReset}
            className="bg-blue-700 w-full p-3 rounded-xl cursor-pointer font-medium flex justify-center gap-0.5"
          >
            <img src="SVG/restart.svg" alt="restart" />
            REMATCH
          </button>

          <div>
            <button className="flex cursor-pointer bg-grey-color rounded-xl px-10 py-3">
              <img src="SVG/add.svg" alt="add" width={20} height={20} />
              New Game
            </button>
            <button></button>
          </div>
        </div>

        <div className="h-[10%] border-t border-gray-800"></div>
      </div>
    </div>
  );
};

export default GameResult;
