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

    if (fromPiece.type === "pawn") {
      if (!pawnMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    if (fromPiece.type === "rook") {
      if (!rookMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    if (fromPiece.type === "bishop") {
      if (!bishopMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    if (fromPiece.type === "queen") {
      if (!queenMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    if (fromPiece.type === "king") {
      if (!kingMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    if (fromPiece.type === "knight") {
      if (!knightMove(dragFrom, to, turn, board)) {
        setDragFrom(null);
        return;
      }
    }

    const newBoard = { ...board };
    newBoard[to] = fromPiece;
    newBoard[dragFrom] = null;

    setboard(newBoard);
    setTurn(turn === "white" ? "black" : "white");
    setDragFrom(null);
  };

  const pawnMove = (from, to, turn, board) => {
    const fromFile = from[0];
    const fromRank = Number(from[1]);

    const toFile = to[0];
    const toRank = Number(to[1]);

    const targetPiece = board[to];

    const direction = turn === "white" ? 1 : -1;

    const startSquare = turn === "white" ? 2 : 7;

    const middleRank = fromRank + direction;
    const middlesquare = fromFile + middleRank;

    //one square
    if (
      fromFile === toFile &&
      toRank === fromRank + direction &&
      !targetPiece
    ) {
      return true;
    }

    //2 square
    if (
      fromRank === startSquare &&
      fromFile === toFile &&
      toRank === fromRank + 2 * direction &&
      !board[middlesquare] &&
      !targetPiece
    ) {
      return true;
    }

    //capture
    if (
      Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0)) === 1 &&
      toRank === fromRank + direction &&
      targetPiece &&
      targetPiece.color !== turn
    ) {
      return true;
    }

    return false;
  };

  const rookMove = (from, to, turn, board) => {
    const fromFile = from[0];
    const fromRank = Number(from[1]);

    const toFile = to[0];
    const toRank = Number(to[1]);

    const targetPiece = board[to];

    if (fromFile !== toFile && fromRank !== toRank) {
      return false;
    }

    const fileStep = fromFile === toFile ? 0 : fromFile < toFile ? 1 : -1;
    const rankStep = fromRank === toRank ? 0 : fromRank < toRank ? 1 : -1;

    let currentFile = fromFile.charCodeAt(0) + fileStep;
    let currentRank = fromRank + rankStep;

    while (currentFile !== toFile.charCodeAt(0) || currentRank !== toRank) {
      const square = String.fromCharCode(currentFile) + currentRank;

      if (board[square]) return false;

      currentFile += fileStep;
      currentRank += rankStep;
    }

    if (targetPiece && targetPiece.color === turn) {
      return false;
    }

    return true;
  };

  const bishopMove = (from, to, turn, board) => {
    const fromFile = from[0];
    const fromRank = Number(from[1]);

    const toFile = to[0];
    const toRank = Number(to[1]);

    const targetPiece = board[to];

    const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
    const rankDiff = Math.abs(toRank - fromRank);

    if (fileDiff !== rankDiff) return false;

    const fileStep = toFile > fromFile ? 1 : -1;
    const rankStep = toRank > fromRank ? 1 : -1;

    let currentFile = fromFile.charCodeAt(0) + fileStep;
    let currentRank = fromRank + rankStep;

    while (currentFile !== toFile.charCodeAt(0) && currentRank !== toRank) {
      const square = String.fromCharCode(currentFile) + currentRank;

      if (board[square]) {
        return false;
      }

      currentFile += fileStep;
      currentRank += rankStep;

      if (targetPiece && targetPiece.color === turn) {
        return false;
      }
    }

    return true;
  };

  const queenMove = (from, to, turn, board) => {
    return rookMove(from, to, turn, board) || bishopMove(from, to, turn, board);
  };

  const kingMove = (from, to, turn, board) => {
    const fromFile = from[0];
    const fromRank = Number(from[1]);
    const toFile = to[0];
    const toRank = Number(to[1]);

    const fileDiff = Math.abs(toFile.charCodeAt(0) - fromFile.charCodeAt(0));
    const rankDiff = Math.abs(toRank - fromRank);

    if (fileDiff > 1 || rankDiff > 1) return false;
    if (fileDiff === 0 && rankDiff === 0) return false;

    const targetPiece = board[to];
    if (targetPiece && targetPiece.color === turn) return false;

    return true;
  };

  const knightMove = (from, to, turn, board) => {
  const fromFile = from[0];
  const fromRank = Number(from[1]);

  const toFile = to[0];
  const toRank = Number(to[1]);

  const fileDiff = Math.abs(
    toFile.charCodeAt(0) - fromFile.charCodeAt(0)
  );
  const rankDiff = Math.abs(toRank - fromRank);

  // L-shape only
  const isKnightShape =
    (fileDiff === 2 && rankDiff === 1) ||
    (fileDiff === 1 && rankDiff === 2);

  if (!isKnightShape) return false;

  const targetPiece = board[to];
  if (targetPiece && targetPiece.color === turn) {
    return false;
  }

  return true;
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
