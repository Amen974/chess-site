import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";

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

    const piece = board[dragFrom];
    if (!piece || piece.color !== turn) {
      setDragFrom(null);
      return;
    }

    const newBoard = { ...board };
    newBoard[to] = piece;
    newBoard[dragFrom] = null;

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
