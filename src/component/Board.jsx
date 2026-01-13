import { useState } from "react";
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

  /* ================= RENDER ================= */

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-wrap gap-2 justify-center md:items-center">
        <div className="grid grid-cols-8 border-4 border-grey-color rounded-2xl overflow-hidden">
          {ranks.map((rank) =>
            files.map((file) => {
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
        <div>
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

            <button className="button-style transition-all active:scale-95 shadow-sm">
              <img src="/SVG/flip.svg" alt="Flip" className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">FLIP</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1e232e] border border-slate-700 shadow-sm mt-4">
            <div className="flex-1 relative">
              <img
                src="/SVG/input.svg"
                alt="Input"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
              />
              <input
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-700 bg-[#111318] text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Import FEN..."
                onKeyDown={(e) => e.key === "Enter" && handleImportFEN()}
              />
            </div>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#282e39] text-xs font-semibold text-slate-300 hover:bg-[#343a46] transition-colors border border-slate-600"
              onClick={handleCopyFEN}
            >
              <img src="/SVG/copy.svg" alt="Copy" className="w-4 h-4" />
              Export FEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;