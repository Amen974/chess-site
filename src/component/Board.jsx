import { useState } from "react";
import { files, ranks, startP } from "../constant";
import Square from "./Square";
import PromotionModal from "./PromotionModal";
import { isLightSquare } from "../engine/validation/isLightSquare";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { undoMove } from "../engine/undoMove";
import { exportFEN } from "../engine/exportFEN";
import { importFEN } from "../engine/importFEN";

const Board = () => {
  const [board, setBoard] = useState({ ...startP });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [turn, setTurn] = useState("white");
  const [dragFrom, setDragFrom] = useState(null);
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
    if (!result) return;

    

    setBoard(result.board);
    setHistory((h) => [...h, result.move]);
    setRedoStack([]);
    setTurn(result.turn);
    setCastlingRights(result.castlingRights);
    setEnPassantSquare(result.enPassantSquare);
    setHalfmoveClock(result.halfmoveClock);
    setFullmoveNumber(result.fullmoveNumber)
    setPromotion(result.promotion);
  };

  /* ================= Click ================= */

  const handleSquareClick = (square) => {
    if(promotion) return

    if (!selectedSquare){
      const piece = board[square]
      if (!piece) return
      if (piece.color !== turn) return
      setSelectedSquare(square)
      return; 
    }
    
    if (square === selectedSquare){
      setSelectedSquare(null)
      return
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
  }

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
    setFullmoveNumber(prev.fullmoveNumber)

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
    setFullmoveNumber(result.fullmoveNumber)
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
      setFullmoveNumber(data.fullmove)

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
    <div className="h-screen w-screen flex justify-center items-center">

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

      
    </div>   
  );
};

export default Board;
