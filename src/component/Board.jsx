import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";
import PromotionModal from "./PromotionModal";
import { isLightSquare } from "../engine/validation/isLightSquare";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { undoMove } from "../engine/undoMove";

const Board = () => {
  const [board, setBoard] = useState({ ...startP });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [turn, setTurn] = useState("white");
  const [dragFrom, setDragFrom] = useState(null);

  const [castlingRights, setCastlingRights] = useState({
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true },
  });

  const [enPassantSquare, setEnPassantSquare] = useState(null);
  const [halfmoveClock, setHalfmoveClock] = useState(0);
  const [promotion, setPromotion] = useState(null);

  /* ================= DRAG ================= */

  const handleDragStart = (from) => {
    const piece = board[from];
    if (!piece) return;
    if (piece.color !== turn) return;
    if (promotion) return;

    setDragFrom(from);
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
    });

    setDragFrom(null);
    if (!result) return;

    setBoard(result.board);
    setHistory(prev => [...prev, result.move])
    setTurn(result.turn);
    setCastlingRights(result.castlingRights);
    setEnPassantSquare(result.enPassantSquare);
    setHalfmoveClock(result.halfmoveClock);
    setPromotion(result.promotion);

    if (result.gameResult) {
      if (result.gameResult.result === "checkmate") {
        alert(`${result.gameResult.winner} wins by checkmate`);
      } else {
        alert(`Draw by ${result.gameResult.reason}`);
      }
    }
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

  /* ================= Undo ================= */
  const handleUndo = () => {
  const lastMove = history.at(-1);
  if (!lastMove) return;

  const prev = undoMove({
    board,
    lastMove,
    castlingRights,
    enPassantSquare,
    halfmoveClock,
  });

  if (!prev) return;

  setBoard(prev.board);
  setTurn(prev.turn);
  setCastlingRights(prev.castlingRights);
  setEnPassantSquare(prev.enPassantSquare);
  setHalfmoveClock(prev.halfmoveClock);

  setHistory(h => h.slice(0, -1));
  setRedoStack(r => [...r, lastMove]);
};

/* ================= Redo ================= */
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
  });

  if (!result) return;

  setBoard(result.board);
  setTurn(result.turn);
  setCastlingRights(result.castlingRights);
  setEnPassantSquare(result.enPassantSquare);
  setHalfmoveClock(result.halfmoveClock);
  setPromotion(result.promotion);

  setHistory(h => [...h, result.move]);
  setRedoStack(r => r.slice(0, -1));
  };

  /* ================= RENDER ================= */

  return (
    <>
      <div className="grid grid-cols-8 border-2">
        {ranks.map((rank) =>
          files.map((file) => {
            const squareId = file + rank;
            const light = isLightSquare(squareId);

            return (
              <Square
                key={squareId}
                id={squareId}
                color={light ? "bg-green-800" : "bg-white"}
                piece={board[squareId]}
                onDragStart={handleDragStart}
                onDrop={handleOnDrop}
              />
            );
          })
        )}
      </div>

      {promotion && (
        <PromotionModal
          color={promotion.color}
          onSelect={handlePromotion}
        />
      )}

      <button className="bg-red-700 border-2 rounded-2xl p-1 text-white cursor-pointer" onClick={handleUndo}>UNDO</button>
      <button className="bg-red-700 border-2 rounded-2xl p-1 text-white cursor-pointer" onClick={handleRedo}>REDO</button>
    </>
  );
};

export default Board;
