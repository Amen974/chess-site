import { evaluateGameEnd } from "./endgame/evaluateGameEnd";
import { updateCastlingRights } from "./state/updateCastlingRights";
import { updateEnPassantSquare } from "./state/updateEnPassantSquare";
import { updateHalfmoveClock } from "./state/updateHalfmoveClock";
import { canCastleKingSide } from "./validation/canCastleKingSide";
import { canCastleQueenSide } from "./validation/canCastleQueenSide";
import { isLegalMove } from "./validation/isLegalMove";
import { isPromotionSquare } from "./validation/isPromotionSquare";


export function applyPlayerMove({
  board,
  from,
  to,
  turn,
  castlingRights,
  enPassantSquare,
  halfmoveClock,
}) {
  const piece = board[from];
  if (!piece || piece.color !== turn) return null;

  let newBoard = { ...board };
  let newCastlingRights = structuredClone(castlingRights);
  let newEnPassantSquare = null;
  let newHalfmoveClock = halfmoveClock;
  let promotion = null;

  const capturedPiece = board[to];

  const move = {
  from,
  to,
  piece,
  captured: capturedPiece,
  prevCastlingRights: structuredClone(castlingRights),
  prevEnPassantSquare: enPassantSquare,
  prevHalfmoveClock: halfmoveClock,
  promotion: null,
  special: null,
  };


  /* ================= CASTLING ================= */

  if (canCastleKingSide(piece, from, to, board, castlingRights)) {
    newBoard = handleCastle(board, piece.color, "king");
    move.special = "castle-king"; 
    updateCastlingRights(from, piece, (v) => (newCastlingRights = v));
    return finalizeTurn({
      board: newBoard,
      turn,
      castlingRights: newCastlingRights,
      enPassantSquare: null,
      halfmoveClock: newHalfmoveClock,
      move,
    });
  }

  if (canCastleQueenSide(piece, from, to, board, castlingRights)) {
    newBoard = handleCastle(board, piece.color, "queen");
    move.special = "castle-queen";
    updateCastlingRights(from, piece, (v) => (newCastlingRights = v));
    return finalizeTurn({
      board: newBoard,
      turn,
      castlingRights: newCastlingRights,
      enPassantSquare: null,
      halfmoveClock: newHalfmoveClock,
      move,
    });
  }

  /* ================= NORMAL MOVE ================= */

  if (!isLegalMove(from, to, board, turn, enPassantSquare)) return null;

  newBoard[to] = piece;
  newBoard[from] = null;

  /* ================= EN PASSANT CAPTURE ================= */

  if (piece.type === "pawn" && to === enPassantSquare) {
    const dir = piece.color === "white" ? -1 : 1;
    const capturedSquare = to[0] + (Number(to[1]) + dir);

    move.captured = board[capturedSquare];
    move.special = "en-passant";
    
    newBoard[capturedSquare] = null;
  }

  /* ================= STATE UPDATES ================= */

  updateCastlingRights(from, piece, (v) => (newCastlingRights = v));
  updateHalfmoveClock(from, to, piece, newBoard, (v) => (newHalfmoveClock = v));
  updateEnPassantSquare(from, to, piece, (v) => (newEnPassantSquare = v));

  /* ================= PROMOTION ================= */

  if (isPromotionSquare(to, newBoard)) {
    promotion = { square: to, color: piece.color };
    return {
      board: newBoard,
      turn,
      castlingRights: newCastlingRights,
      enPassantSquare: newEnPassantSquare,
      halfmoveClock: newHalfmoveClock,
      promotion,
      move,
      gameResult: null,
    };
  }

  /* ================= GAME END ================= */

  const enemyColor = turn === "white" ? "black" : "white";
  const gameResult = evaluateGameEnd(turn, newBoard, newHalfmoveClock);

  return {
    board: newBoard,
    turn: enemyColor,
    castlingRights: newCastlingRights,
    enPassantSquare: newEnPassantSquare,
    halfmoveClock: newHalfmoveClock,
    promotion: null,
    move,
    gameResult,
  };
}

/* ================= HELPERS ================= */

function handleCastle(board, color, side) {
  const next = { ...board };

  if (color === "white") {
    if (side === "king") {
      next.g1 = next.e1;
      next.f1 = next.h1;
      next.e1 = next.h1 = null;
    } else {
      next.c1 = next.e1;
      next.d1 = next.a1;
      next.e1 = next.a1 = null;
    }
  } else {
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

  return next;
}

function finalizeTurn(state) {
  return {
    ...state,
    turn: state.turn === "white" ? "black" : "white",
    promotion: null,
    gameResult: null,
  };
}
