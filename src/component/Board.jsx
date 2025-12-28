import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";
import { isLegalMove } from "../moves/IsLegalMove";
import { isPromotionSquare } from "../moves/IsPromotionSquare";
import PromotionModal from "./PromotionModal";
import { updateCastlingRights } from "../moves/UpdateCastlingRights";
import { canCastleKingSide } from "../moves/CanCastleKingSide";
import { canCastleQueenSide } from "../moves/canCastleQueenSide";
import { isLightSquare } from "../moves/isLightSquare";
import { updateHalfmoveClock } from "../moves/updateHalfmoveClock";
import { evaluateGameEnd } from "../moves/evaluateGameEnd";


const Board = () => {
  const [board, setBoard] = useState({ ...startP });
  const [dragFrom, setDragFrom] = useState(null);
  const [turn, setTurn] = useState("white");
  const [promotion, setPromotion] = useState(null);
  const [castlingRights, setCastlingRights] = useState({
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true },
  });
  const [halfmoveClock, setHalfmoveClock] = useState(0);
  
  const handleDragStart = (from) => {
    const piece = board[from];
    if (!piece) return;
    if (piece.color !== turn) return;
    if (promotion) return;

    setDragFrom(from);
  };

  const handleOnDrop = (to) => {
    if (!dragFrom) return;

    const piece = board[dragFrom];
    if (!piece || piece.color !== turn) {
      setDragFrom(null);
      return;
    }

    if (canCastleKingSide(piece, dragFrom, to, board, castlingRights)) {
      handleCastle(piece, "king");
      updateCastlingRights(dragFrom, piece, setCastlingRights);
      endTurn();
      return;
    }

    if (canCastleQueenSide(piece, dragFrom, to, board, castlingRights)) {
      handleCastle(piece, "queen");
      updateCastlingRights(dragFrom, piece, setCastlingRights);
      endTurn();
      return;
    }

    if (!isLegalMove(dragFrom, to, board, turn)) {
      setDragFrom(null);
      return;
    }

    const newBoard = { ...board };
    newBoard[to] = piece;
    newBoard[dragFrom] = null;

    updateCastlingRights(dragFrom, piece, setCastlingRights);
    updateHalfmoveClock(dragFrom, to, piece, newBoard, setHalfmoveClock)

    if (isPromotionSquare(to, newBoard)) {
      setPromotion({ square: to, color: piece.color });
      setBoard(newBoard);
      return;
    }

    const enemyColor = turn === "white" ? "black" : "white";

   const result = evaluateGameEnd(turn, newBoard, halfmoveClock);

  if (result) {
    if (result.result === "checkmate") {
      alert(`${result.winner} wins by checkmate`);
    } else {
      alert(`Draw by ${result.reason}`);
      }
  return;
}

    setBoard(newBoard);
    setTurn(enemyColor);
    setDragFrom(null);
  };

  const handleCastle = (piece, side) => {
    const next = { ...board };

    if (piece.color === "white") {
      if (side === "king") {
        next.g1 = next.e1;
        next.f1 = next.h1;
        next.e1 = next.h1 = null;
      } else {
        next.c1 = next.e1;
        next.d1 = next.a1;
        next.e1 = next.a1 = null;
      }
    }

    if (piece.color === "black") {
      if (side === "king") {
        next.g8 = next.e8;
        next.f8 = next.h8;
        next.e8 = next.h8 = null;
      } else {
        next.c8 = next.e8;
        next.d8 = next.a8;
        next.e8 = next.a8 = null;
      }
    }

    setBoard(next);
  };

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

  const endTurn = () => {
    setTurn(turn === "white" ? "black" : "white");
    setDragFrom(null);
  };

  return (
    <>
      <div className="grid grid-cols-8 border-2">
        {ranks.map((rank) =>
          files.map((file) => {
            const squareId = file + rank;
            const isWhite = isLightSquare(squareId)

            return (
              <Square
                key={squareId}
                id={squareId}
                color={isWhite ? "bg-green-800" : "bg-white" }
                piece={board[squareId]}
                onDragStart={handleDragStart}
                onDrop={handleOnDrop}
              />
            );
          })
        )}
      </div>

      {promotion && (
        <PromotionModal color={promotion.color} onSelect={handlePromotion} />
      )}
    </>
  );
};

export default Board;
