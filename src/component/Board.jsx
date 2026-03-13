import { useState, useEffect, useRef, useReducer } from "react";
import { files, ranks } from "../constant";
import Square from "./Square";
import PromotionModal from "./PromotionModal";
import { isLightSquare } from "../engine/validation/isLightSquare";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { exportFEN } from "../engine/exportFEN";
import { isLegalMove } from "../engine/validation/isLegalMove";
import { playAIMove } from "../engine/playAIMove";
import { gameReducer } from "../engine/game/gameReducer";
import { initialGameState } from "../engine/game/initialGameState";
import GameResult from "./GameResult";
import gsap from "gsap";

const Board = () => {
  const [dragFrom, setDragFrom] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [fenInput, setFenInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [viewingIndex, setViewingIndex] = useState(-1);
  const [lastMove, setLastMove] = useState({});

  const renderRanks = isFlipped ? [...ranks].reverse() : ranks;
  const renderFiles = isFlipped ? [...files].reverse() : files;

  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { board, turn, aiTurn, enPassantSquare, history, promotion } = state;

  const fen = exportFEN(state);

  const displayBoard =
    viewingIndex >= 0 && viewingIndex < history.length
      ? history[viewingIndex].board
      : board;

  const isBrowsing = viewingIndex >= 0 && viewingIndex < history.length - 1;

  /* ================= REQUEST MOVE ================= */

  async function requestMove({ from, to }) {
    setViewingIndex(-1);
    setSelectedSquare(null);
    setLegalMoves([]);
    setDragFrom(null);
    setLastMove({});

    if (state.gameResult) return;

    const result = applyPlayerMove({ from, to, state });
    if (!result) return;

    dispatch({ type: "COMMIT_MOVE", result });
    setLastMove({ from, to });

    if (result.gameResult) return;

    if (result.turn === aiTurn) {
      startSpin();
      const aiResult = await playAIMove(result);
      stopSpin();
      dispatch({ type: "COMMIT_MOVE", result: aiResult ?? result });
      if (aiResult)
        setLastMove({ from: aiResult.move.from, to: aiResult.move.to });
      return;
    }

    dispatch({ type: "COMMIT_MOVE", result });
  }

  /* ================= GAME RESULT TIMEOUT ================= */

  useEffect(() => {
    if (!state.gameResult) {
      return;
    }
    const timer = setTimeout(() => setShowResult(true), 500);
    return () => clearTimeout(timer);
  }, [state.gameResult]);

  /* ================= AUTO SCROLL ================= */

  const sanRefMobile = useRef(null);
  const sanRefDesktop = useRef(null);

  useEffect(() => {
    const elMobile = sanRefMobile.current;
    if (elMobile) elMobile.scrollLeft = elMobile.scrollWidth;

    const elDesktop = sanRefDesktop.current;
    if (elDesktop) elDesktop.scrollTop = elDesktop.scrollHeight;
  }, [history.length]);

  /* ================= AI FIRST MOVE ================= */

  useEffect(() => {
    if (history.length !== 0) return;
    if (turn !== aiTurn) return;

    playAIMove(state).then((result) => {
      if (result) dispatch({ type: "COMMIT_MOVE", result });
    });
  }, [aiTurn]);

  /* ================= DRAG ================= */

  const handleDragStart = (from) => {
    if (isBrowsing) return;
    const piece = board[from];
    if (!piece || piece.color !== turn || promotion) return;
    setDragFrom(from);
    setLegalMoves(computeLegalMoves(from));
  };

  /* ================= DROP ================= */

  const handleOnDrop = (to) => {
    if (isBrowsing) return;
    if (!dragFrom) return;
    requestMove({ from: dragFrom, to });
  };

  /* ================= CLICK ================= */

  const handleSquareClick = (square) => {
    if (isBrowsing) return;
    if (promotion) return;

    if (!selectedSquare) {
      const piece = board[square];
      if (!piece || piece.color !== turn) return;
      setSelectedSquare(square);
      setLegalMoves(computeLegalMoves(square));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = board[square];
    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      setLegalMoves(computeLegalMoves(square));
      return;
    }

    requestMove({ from: selectedSquare, to: square });
  };

  const computeLegalMoves = (from) => {
    const moves = [];
    for (const r of ranks) {
      for (const f of files) {
        const to = f + r;
        if (
          isLegalMove(
            from,
            to,
            board,
            turn,
            enPassantSquare,
            state.castlingRights,
          )
        ) {
          moves.push(to);
        }
      }
    }
    return moves;
  };

  /* ================= jumpToPosition ================= */

  const jumpToPosition = (i) => {
    setViewingIndex(i);
  };

  /* ================= IMPORT FEN ================= */

  const handleImportFEN = () => {
    try {
      dispatch({ type: "IMPORT_FEN", fen: fenInput });
      setFenInput("");
      setDragFrom(null);
      setSelectedSquare(null);
      setLegalMoves([]);
    } catch {
      alert("Invalid FEN");
    }
  };

  /* ================= EXPORT FEN ================= */

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      alert("FEN copied to clipboard");
    } catch {
      alert("Failed to copy FEN");
    }
  };

  /* ================= ANIMATION ================= */

  const robotRef = useRef(null);
  const spinRef = useRef(null);

  const startSpin = () => {
    spinRef.current = gsap.to(robotRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
  };

  const stopSpin = () => {
    if (spinRef.current) {
      spinRef.current.kill();
      gsap.to(robotRef.current, { rotation: 0, duration: 0.3 });
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {showResult && (
        <GameResult
          gameResult={state.gameResult}
          handelReset={() => {
            (dispatch({ type: "RESET" }), setShowResult(false));
          }}
          handelClose={() => setShowResult(false)}
        />
      )}
      <div className="flex flex-wrap gap-2 justify-center items-center lg:items-end">
        <div className="flex-col">
          <div className="flex h-8 md:h-12 pl-1 mb-0.5">
            <div className="flex items-center justify-center h-full w-8 md:w-12 bg-grey-color rounded-full border-3 border-blue-700">
              <img src="SVG/ai-blue.svg" alt="ai" ref={robotRef} />
            </div>
          </div>

          <div className="grid grid-cols-8 border-4 border-grey-color rounded-2xl overflow-hidden">
            {renderRanks.map((rank) =>
              renderFiles.map((file) => {
                const squareId = file + rank;
                const light = isLightSquare(squareId);

                return (
                  <Square
                    key={squareId}
                    id={squareId}
                    color={light ? "blackSquare" : "whiteSquare"}
                    piece={displayBoard[squareId]}
                    onClick={handleSquareClick}
                    onDragStart={handleDragStart}
                    onDrop={handleOnDrop}
                    isSelected={squareId === selectedSquare}
                    isLegalMove={legalMoves.includes(squareId)}
                    isLastMove={
                      squareId === lastMove.from || squareId === lastMove.to
                    }
                  />
                );
              }),
            )}
          </div>
        </div>

        {promotion && (
          <PromotionModal
            color={promotion.color}
            onSelect={(type) =>
              dispatch({
                type: "PROMOTE",
                square: promotion.square,
                piece: type,
                color: promotion.color,
              })
            }
          />
        )}

        <div className="flex flex-col gap-2">
          <div
            className="flex lg:hidden max-w-80 text-slate-400 whitespace-nowrap overflow-x-auto no-scrollbar"
            ref={sanRefMobile}
          >
            {history.map((move, index) => {
              const moveNumber = Math.floor(index / 2) + 1;
              const isWhite = index % 2 === 0;
              return (
                <div key={index} className="flex items-center">
                  {isWhite && (
                    <span className="text-slate-400 w-6 text-right">
                      {moveNumber}.
                    </span>
                  )}
                  <button
                    onClick={() => jumpToPosition(index)}
                    className="text-white mr-4"
                  >
                    {move.san}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className="hidden lg:block max-w-100 h-110 2xl:h-125 bg-[#1e232e] border border-slate-700 rounded-lg overflow-y-auto no-scrollbar"
            ref={sanRefDesktop}
          >
            {Array.from({ length: Math.ceil(history.length / 2) }).map(
              (_, i) => {
                const whiteMove = history[i * 2];
                const blackMove = history[i * 2 + 1];
                return (
                  <div key={i} className="flex items-center gap-2 text-sm p-2">
                    <span className="text-slate-400 text-right mr-1">
                      {i + 1}.
                    </span>
                    {whiteMove && (
                      <div
                        onClick={() => jumpToPosition(i * 2)}
                        className="text-white flex-1 hover:bg-[#101622] hover:text-blue-700 rounded-lg p-2 cursor-pointer"
                      >
                        {whiteMove.san}
                      </div>
                    )}
                    {blackMove && (
                      <div
                        onClick={() => jumpToPosition(i * 2 + 1)}
                        className="text-white flex-1 hover:bg-[#101622] hover:text-blue-700 rounded-lg p-2 cursor-pointer"
                      >
                        {blackMove.san}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          <div className="w-full flex justify-center gap-1">
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!!state.gameResult}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/undo.svg" alt="Undo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">UNDO</span>
            </button>

            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!!state.gameResult}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/redo.svg" alt="Redo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">REDO</span>
            </button>

            <button
              onClick={() => dispatch({ type: "resign" })}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/resign.svg" alt="Resign" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">RESIGN</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped((f) => !f);
                dispatch({ type: "FLIP_BOARD" });
              }}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/flip.svg" alt="Flip" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">FLIP</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg bg-[#1e232e] border border-slate-700 shadow-sm">
            <div className="flex-1 relative">
              <img
                src="/SVG/input.svg"
                alt="Input"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 text-slate-400"
              />
              <input
                className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs rounded border border-slate-700 bg-[#111318] text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Import FEN..."
                onKeyDown={(e) => e.key === "Enter" && handleImportFEN()}
                disabled={!!state.gameResult}
              />
            </div>
            <button
              className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#282e39] text-xs font-semibold text-slate-300 hover:bg-[#343a46] transition-colors border border-slate-600 cursor-pointer"
              onClick={handleCopyFEN}
            >
              <img
                src="/SVG/copy.svg"
                alt="Copy"
                className="w-3.5 sm:w-4 h-3.5 sm:h-4"
              />
              Export FEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
