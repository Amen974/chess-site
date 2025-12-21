import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";

const Board = () => {
  const initialBoard = startP;
  const [board,setboard] = useState(initialBoard);
  const [dragFrom,setDragFrom] = useState(null)
  const handelDragStart = (from)=>{
    setDragFrom(from);
  }
  const handelOnDrop = (to)=>{
    if(!dragFrom || dragFrom === to)return;
    const newBoard = { ...board };
    newBoard[to] = newBoard[dragFrom];
    newBoard[dragFrom] = '';
    setDragFrom(null);
    setboard(newBoard)
  }
  return (
    <div className="grid grid-cols-8 border-2">
      {ranks.map(rank=>
        files.map(file=>{
          const squarId = file + rank
          const isBlack = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1
          const piece = board[squarId];
          return(
            <Square
              key={squarId}
              id={squarId}
              color={isBlack ? 'bg-green-800' : 'bg-white'}
              img={piece}
              onDragStart={handelDragStart}
              onDrop={handelOnDrop}
            />
          )
          
        })
      )}
    </div>
  );
};

export default Board;
