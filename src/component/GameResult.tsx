import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import type { GameResult } from "../types";

const GameResult = ({ gameResult, handelClose, onNewGame  }: {gameResult: NonNullable<GameResult>, handelClose: () => void, onNewGame: () => void}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const reasonRef = useRef(null);
  const avatarsRef = useRef(null);
  const buttonsRef = useRef(null);
  const newGameRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    })
      .from(titleRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      .from(
        reasonRef.current,
        {
          y: -10,
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.1",
      )
      .from(
        avatarsRef.current,
        {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "-=0.1",
      )
      .from(
        buttonsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1",
      )
      .from(
        newGameRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1",
      );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handelClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handelClose]);

  return (
    <div
      onClick={handelClose}
      className="h-screen w-screen flex items-center justify-center fixed z-10 backdrop-blur-xs bg-slate-900/90 shadow-2xl text-white"
    >
      <div
        className="bg-[#101622] h-[60%] w-90 sm:w-120 sm:h-[70%] rounded-2xl shadow-2xl border border-gray-800"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[13%] border-b border-gray-800 flex items-center gap-2 p-6 text-gray-400 font-medium text-sm relative">
          <img src="SVG/trophy.svg" alt="trophy" />
          <p>GAME SUMMARY</p>
          <button
            onClick={handelClose}
            className="cursor-pointer absolute right-5"
          >
            <img src="SVG/close.svg" alt="close" width={20} height={20} />
          </button>
        </div>

        <div className="h-[77%] flex flex-col items-center p-7 gap-7">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold" ref={titleRef}>
              {" "}
              {gameResult.result === "draw"
                ? "Draw!"
                : `${gameResult.winner} Wins!`}
            </h1>
            <p className="text-blue-700 font-medium" ref={reasonRef}>
              BY {gameResult.reason}
            </p>
          </div>

          <div ref={avatarsRef} className="flex gap-6 items-center mb-3">
            <div className="h-15 w-15 flex items-center justify-center bg-gray-800 rounded-full">
              <img src="SVG/human.svg" alt="human" width={40} height={40} />
            </div>

            <p className="font-bold text-xl text-gray-400">VS</p>

            <div className="h-15 w-15 flex items-center justify-center bg-gray-800 rounded-full">
              <img src="SVG/ai-blue.svg" alt="ai" height={40} width={40} />
            </div>
          </div>


            <button
              ref={newGameRef}
              className="flex justify-center cursor-pointer bg-blue-700 rounded-xl px-10 py-3 font-medium w-full"
               onClick={() => { handelClose(); onNewGame();}}
            >
              <img src="SVG/add.svg" alt="add" width={20} height={20} />
              New Game
            </button>

        </div>

        <div className="h-[10%] border-t border-gray-800 flex items-center justify-center text-xs font-medium text-gray-500">
          <p>READY FOR ANOTHER GAME ?</p>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
