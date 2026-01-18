import { useState, useEffect, useRef } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";
import PromotionModal from "./PromotionModal";
import { isLightSquare } from "../engine/validation/isLightSquare";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { undoMove } from "../engine/undoMove";
import { exportFEN } from "../engine/exportFEN";
import { importFEN } from "../engine/importFEN";
import { isLegalMove } from "../engine/validation/isLegalMove";

const Board = () => {
  const [board, setBoard] = useState({ ...startP });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [turn, setTurn] = useState("white");
  const [dragFrom, setDragFrom] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [fenInput, setFenInput] = useState("");

  const [castlingRights, setCastlingRights] = useState({
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true },
  });

  const [enPassantSquare, setEnPassantSquare] = useState(null);
  const [halfmoveClock, setHalfmoveClock] = useState(0);
  const [fullmoveNumber, setFullmoveNumber] = useState(1);
  const [promotion, setPromotion] = useState(null);

  const [isFlipped, setIsFlipped] = useState(false);
  const renderRanks = isFlipped ? [...ranks].reverse() : ranks;
  const renderFiles = isFlipped ? [...files].reverse() : files;

  /* ================= AUTO SCROLL ================= */
  
  const sanRefMobile = useRef(null);
  const sanRefDesktop = useRef(null);

useEffect(() => {
  const elMobile = sanRefMobile.current;
  if (elMobile) {
    elMobile.scrollLeft = elMobile.scrollWidth;
  }
  
  const elDesktop = sanRefDesktop.current;
  if (elDesktop) {
    elDesktop.scrollTop = elDesktop.scrollHeight;
  }
}, [history.length]);


  /* ================= DRAG ================= */

  const handleDragStart = (from) => {
    const piece = board[from];
    if (!piece) return;
    if (piece.color !== turn) return;
    if (promotion) return;
    setDragFrom(from);
    setLegalMoves(computeLegalMoves(from));
  };

  /* ================= DROP ================= */

  const handleOnDrop = (to) => {
    if (!dragFrom) return;

    const result = applyPlayerMove({
      board,
      from: dragFrom,
      to,
      turn,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    });

    setDragFrom(null);
    setLegalMoves([]);
    if (!result) return;

    setBoard(result.board);
    setHistory((h) => [...h, result.move]);
    setRedoStack([]);
    setTurn(result.turn);
    setCastlingRights(result.castlingRights);
    setEnPassantSquare(result.enPassantSquare);
    setHalfmoveClock(result.halfmoveClock);
    setFullmoveNumber(result.fullmoveNumber);
    setPromotion(result.promotion);

    if (result.gameResult) {
      if (result.gameResult.result === "checkmate") {
        alert(`${result.gameResult.winner} wins by checkmate`);
      } else {
        alert(`Draw by ${result.gameResult.reason}`);
      }
    }
  };

  /* ================= Click ================= */

  const handleSquareClick = (square) => {
    if (promotion) return;

    if (!selectedSquare) {
      const piece = board[square];
      if (!piece) return;
      if (piece.color !== turn) return;
      setSelectedSquare(square);
      setLegalMoves(computeLegalMoves(square));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      return;
    }

    const result = applyPlayerMove({
      board,
      from: selectedSquare,
      to: square,
      turn,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    });

    setSelectedSquare(null);
    setLegalMoves([]);

    if (!result) return;

    setBoard(result.board);
    setHistory((h) => [...h, result.move]);
    setRedoStack([]);
    setTurn(result.turn);
    setCastlingRights(result.castlingRights);
    setEnPassantSquare(result.enPassantSquare);
    setHalfmoveClock(result.halfmoveClock);
    setFullmoveNumber(result.fullmoveNumber);
    setPromotion(result.promotion);

    if (result.gameResult) {
      if (result.gameResult.result === "checkmate") {
        alert(`${result.gameResult.winner} wins by checkmate`);
      } else {
        alert(`Draw by ${result.gameResult.reason}`);
      }
    }
  };

  const computeLegalMoves = (from) => {
    const moves = [];

    for (const r of ranks) {
      for (const f of files) {
        const to = f + r;
        if (isLegalMove(from, to, board, turn, enPassantSquare)) {
          moves.push(to);
        }
      }
    }

    return moves;
  };

  /* ================= PROMOTION ================= */

  const handlePromotion = (type) => {
    const { square, color } = promotion;

    setBoard((prev) => ({
      ...prev,
      [square]: {
        type,
        color,
        img: `/pieces-basic-svg/${type}-${color[0]}.svg`,
      },
    }));

    setPromotion(null);
    setTurn(color === "white" ? "black" : "white");
  };

  /* ================= UNDO ================= */

  const handleUndo = () => {
    const lastMove = history.at(-1);
    if (!lastMove) return;

    const prev = undoMove({
      board,
      lastMove,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    });

    if (!prev) return;

    setBoard(prev.board);
    setTurn(prev.turn);
    setCastlingRights(prev.castlingRights);
    setEnPassantSquare(prev.enPassantSquare);
    setHalfmoveClock(prev.halfmoveClock);
    setFullmoveNumber(prev.fullmoveNumber);

    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [...r, lastMove]);
  };

  /* ================= REDO ================= */

  const handleRedo = () => {
    const move = redoStack.at(-1);
    if (!move) return;

    const result = applyPlayerMove({
      board,
      from: move.from,
      to: move.to,
      turn,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    });

    if (!result) return;

    setBoard(result.board);
    setTurn(result.turn);
    setCastlingRights(result.castlingRights);
    setEnPassantSquare(result.enPassantSquare);
    setHalfmoveClock(result.halfmoveClock);
    setFullmoveNumber(result.fullmoveNumber);
    setPromotion(result.promotion);

    setHistory((h) => [...h, result.move]);
    setRedoStack((r) => r.slice(0, -1));
  };

  /* ================= IMPORT FEN ================= */

  const handleImportFEN = () => {
    try {
      const data = importFEN(fenInput);

      setBoard(data.board);
      setTurn(data.turn);
      setCastlingRights(data.castlingRights);
      setEnPassantSquare(data.enPassantSquare);
      setHalfmoveClock(data.halfmove);
      setFullmoveNumber(data.fullmove);

      setHistory([]);
      setRedoStack([]);
      setPromotion(null);
      setDragFrom(null);
    } catch (e) {
      alert("Invalid FEN");
    }
  };

  /* ================= EXPORT FEN ================= */
  const handleCopyFEN = async () => {
    const fen = exportFEN({
      board,
      turn,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    });

    try {
      await navigator.clipboard.writeText(fen);
      alert("FEN copied to clipboard");
    } catch {
      alert("Failed to copy FEN");
    }
  };

  /* ================= SAN ================= */
  const jumpToPosition = (fen, index) => {
    const data = importFEN(fen);

    setBoard(data.board);
    setTurn(data.turn);
    setCastlingRights(data.castlingRights);
    setEnPassantSquare(data.enPassantSquare);
    setHalfmoveClock(data.halfmove);
    setFullmoveNumber(data.fullmove);

    setHistory((h) => h.slice(0, index + 1));
    setRedoStack([]);
    setPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  /* ================= RENDER ================= */

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-wrap gap-2 justify-center md:items-center">
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
                piece={board[squareId]}
                onClick={handleSquareClick}
                onDragStart={handleDragStart}
                onDrop={handleOnDrop}
                isSelected={squareId === selectedSquare}
                isLegalMove={legalMoves.includes(squareId)}
              />
              );
            })
          )}
        </div>


        {promotion && (
          <PromotionModal color={promotion.color} onSelect={handlePromotion} />
        )}

        <div className="flex flex-col gap-2">
          <div className="flex lg:hidden max-w-80 text-slate-400 whitespace-nowrap overflow-x-auto no-scrollbar" ref={sanRefMobile}>
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
                    className="text-white mr-4"
                    onClick={() => jumpToPosition(move.fen, index)}
                  >
                    {move.san}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block max-w-100 h-110 2xl:h-125 bg-[#1e232e] border border-slate-700 rounded-lg overflow-y-auto no-scrollbar" ref={sanRefDesktop}>
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
                        className="text-white flex-1 hover:bg-[#101622] rounded-lg p-2 cursor-pointer"
                        onClick={() => jumpToPosition(whiteMove.fen, i * 2)}
                      >
                        {whiteMove.san}
                      </div>
                    )}

                    {blackMove && (
                      <div
                        className="text-white flex-1 hover:bg-[#101622] rounded-lg p-2 cursor-pointer"
                        onClick={() => jumpToPosition(blackMove.fen, i * 2 + 1)}
                      >
                        {blackMove.san}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="w-full flex justify-center gap-1">
            <button
              onClick={handleUndo}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/undo.svg" alt="Undo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">UNDO</span>
            </button>

            <button
              onClick={handleRedo}
              className="button-style transition-all active:scale-95 shadow-sm"
            >
              <img src="/SVG/redo.svg" alt="Redo" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">REDO</span>
            </button>

            <button className="button-style transition-all active:scale-95 shadow-sm">
              <img src="/SVG/resign.svg" alt="Resign" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">RESIGN</span>
            </button>

            <button
              onClick={() => setIsFlipped((f) => !f)}
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
