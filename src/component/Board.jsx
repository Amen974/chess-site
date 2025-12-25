import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";
import { isLegalMove } from "../moves/IsLegalMove";
import { isCheckmate } from "../moves/IsCheckmate";

const Board = () => {
  const [board, setboard] = useState({ ...startP });
  const [dragFrom, setDragFrom] = useState(null);
  const [turn, setTurn] = useState("white");

  const handelDragStart = (from) => {
    const piece = board[from];
    if (!piece) return;
    if (piece.color !== turn) return;

    setDragFrom(from);
  };

  const handelOnDrop = (to) => {
    if (!dragFrom) return;

    if (dragFrom === to) {
      setDragFrom(null);
      return;
    }

    const fromPiece = board[dragFrom];
    if (!fromPiece || fromPiece.color !== turn) {
      setDragFrom(null);
      return;
    }

    const toPiece = board[to];

    if (toPiece && toPiece.color === fromPiece.color) {
      setDragFrom(null);
      return;
    }

    if (!isLegalMove(dragFrom, to, board, turn)) return;

    const newBoard = { ...board };
    newBoard[to] = fromPiece;
    newBoard[dragFrom] = null;

    const enemyColor = turn === "white" ? "black" : "white";
    if (isCheckmate(enemyColor, newBoard)) {
      alert(`${turn} wins by checkmate`);
    }

    setboard(newBoard);
    setTurn(turn === "white" ? "black" : "white");
    setDragFrom(null);
  };

  return (
    <div className="grid grid-cols-8 border-2">
      {ranks.map((rank) =>
        files.map((file) => {
          const squarId = file + rank;
          const isBlack = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1;
          const piece = board[squarId];
          return (
            <Square
              key={squarId}
              id={squarId}
              color={isBlack ? "bg-green-800" : "bg-white"}
              piece={piece}
              onDragStart={handelDragStart}
              onDrop={handelOnDrop}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
