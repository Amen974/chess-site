import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

const GameSetup = ({ onStart, handelClose }) => {
  const [mode, setMode] = useState("ai");
  const [difficulty, setDifficulty] = useState(12);
  const [side, setside] = useState("Random");

  const levels = [
    { label: "Easy", depth: 8 },
    { label: "Normal", depth: 12 },
    { label: "Hard", depth: 14 },
    { label: "Max", depth: 18 },
  ];

  const containerRef = useRef(null);

  useGSAP(()=>{
    gsap.from(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    })
  },[])

  return (
    <div className="h-screen w-screen flex items-center justify-center fixed z-10 backdrop-blur-xs bg-slate-900/90 shadow-2xl text-white">
      <div className="bg-[#101622] h-[70%] w-90 sm:w-120 sm:h-[85%] rounded-2xl shadow-2xl border border-gray-800" ref={containerRef}>
        <div className="flex items-center h-[10%] w-full border-b border-b-gray-700 pl-5 gap-2">
          <img src="SVG/settings.svg" alt="" />
          <h1>Game Setup</h1>
        </div>

        <div className="flex  flex-col gap-10 py-5 px-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              GAME MODE
            </label>
            <div className="relative flex p-1 bg-slate-800 rounded-lg">
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-700 rounded-md shadow-sm transition-transform duration-300 ease-in-out"
                style={{
                  transform:
                    mode === "ai"
                      ? "translateX(0%)"
                      : "translateX(calc(100% + 8px))",
                }}
              />
              <button
                onClick={() => setMode("ai")}
                className={`relative flex-1 py-2 px-4 rounded-md text-sm font-medium z-10 transition-colors duration-200
        ${mode === "ai" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Vs. AI
              </button>
              <button
                onClick={() => setMode("local")}
                className={`relative flex-1 py-2 px-4 rounded-md text-sm font-medium z-10 transition-colors duration-200
        ${mode === "local" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Local / Friend
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              AI Difficulty
            </label>
            <div className="flex gap-2">
              {levels.map(({ label, depth }) => (
                <button
                  key={depth}
                  onClick={() => setDifficulty(depth)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium
                  ${
                    difficulty === depth
                      ? "border-blue-600 bg-blue-600/20 text-white"
                      : "border-slate-700 bg-slate-800/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Play As
            </label>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setside("White")}
                className={`flex-1 aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2
                  ${side === "White" ? "border-blue-600 bg-blue-600/10" : "border-slate-800 bg-slate-800 hover:border-slate-600"}`}
              >
                <div className="w-8 h-8 sm:h-12 sm:w-12 rounded-lg shadow-lg"><img src="pieces-basic-svg/king-w.svg" alt="king"   /></div>
                <p className="text-xs font-bold text-slate-300">White</p>
              </button>

              <button
                onClick={() => setside("Random")}
                className={`flex-1 aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2
                  ${side === "Random" ? "border-blue-600 bg-blue-600/10" : "border-slate-800 bg-slate-800 hover:border-slate-600"}`}
              >
                <div className="w-8 h-8 sm:h-12 sm:w-12 rounded-lg shadow-lg flex"><div className="flex"><img src="pieces-basic-svg/king-wR.png" alt="king-wR" /></div> <div className="flex"><img src="pieces-basic-svg/king-bR.png" alt="king-bR" /></div></div>
                <p className="text-xs font-bold text-slate-300">Random</p>
              </button>

              <button
                onClick={() => setside("Black")}
                className={`flex-1 aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2
                  ${side === "Black" ? "border-blue-600 bg-blue-600/10" : "border-slate-800 bg-slate-800 hover:border-slate-600"}`}
              >
                <div className="w-8 h-8 sm:h-12 sm:w-12 rounded-lg  shadow-lg"><img src="pieces-basic-svg/king-b.svg" alt="king" /></div>
                <p className="text-xs font-bold text-slate-300">Black</p>
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={() => onStart({ mode, difficulty, side }, handelClose())}
              className="w-full py-4 bg-[#1152d4] hover:bg-primary/90 text-white rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <img src="SVG/start.svg" alt="start" />
              Start Game
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Playing against
              <span className="text-slate-300"> Stockfish 16 Engine</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
