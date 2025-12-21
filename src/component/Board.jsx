import { files, ranks } from "../constant";
import Square from "./Square";

const Board = () => {
  return (
    <div className="grid grid-cols-8 border-2 h-150 w-150">
      {ranks.map(rank=>
        files.map(file=>{
          const squarId = file + rank
          const isBlack = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1  
          return(
            <Square
              key={squarId}
              id={squarId}
              color={isBlack ? 'bg-green-800' : 'bg-white'}
            />
          )
          
        })
      )}
    </div>
  );
};

export default Board;
