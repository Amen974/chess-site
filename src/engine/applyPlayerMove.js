import { evaluateGameEnd } from "./endgame/evaluateGameEnd";
import { getRepetitionResult } from "./endgame/getRepetitionResult";
import { exportFEN } from "./exportFEN";
import { updateCastlingRights } from "./state/updateCastlingRights";
import { updateEnPassantSquare } from "./state/updateEnPassantSquare";
import { updateFullmoveNumber } from "./state/updateFullmoveNumber";
import { updateHalfmoveClock } from "./state/updateHalfmoveClock";
import { canCastleKingSide } from "./validation/canCastleKingSide";
import { canCastleQueenSide } from "./validation/canCastleQueenSide";
import { isLegalMove } from "./validation/isLegalMove";
import { isPromotionSquare } from "./validation/isPromotionSquare";
import { generateSAN } from "./generateSAN";
import { createMoveSnapshot } from "./createMoveSnapshot";
import { createNextState } from "./createNextState";
import { handleCastle } from "./helpers/handleCastle";

export function applyPlayerMove({
  from,
  to,
  state
}) {
  const piece = state.board[from];
  if (!piece || piece.color !== state.turn) return null;

  const move = createMoveSnapshot(state, from, to);
  const nextState = createNextState(state);

  let promotion = null;

  const enemyColor = state.turn === "white" ? "black" : "white";

  /* ================= CASTLING ================= */

  if (canCastleKingSide(piece, from, to, state.board, state.castlingRights)) {
    nextState.board = handleCastle(nextState.board, piece.color, "king");
    move.special = "castle-king";
    move.san = "O-O";

    move.fen = exportFEN({
      board: nextState.board,
      turn: enemyColor,
      castlingRights: nextState.castlingRights,
      enPassantSquare: null,
      halfmoveClock: nextState.halfmoveClock,
      fullmoveNumber: nextState.fullmoveNumber,
    });

    return finalizeTurn({
      board: nextState.board,
      turn: nextState.turn,
      castlingRights: nextState.castlingRights,
      enPassantSquare: null,
      halfmoveClock: nextState.halfmoveClock,
      fullmoveNumber: nextState.fullmoveNumber,
      move,
    });
  }

  if (canCastleQueenSide(piece, from, to, state.board, state.castlingRights)) {
    nextState.board = handleCastle(nextState.board, piece.color, "queen");
    move.special = "castle-queen";
    move.san = "O-O-O";

    const enemyColor = state.turn === "white" ? "black" : "white";

    move.fen = exportFEN({
      board: nextState.board,
      turn: enemyColor,
      castlingRights: nextState.castlingRights,
      enPassantSquare: null,
      halfmoveClock: nextState.halfmoveClock,
      fullmoveNumber: nextState.fullmoveNumber,
    });

    return finalizeTurn({
      board: nextState.board,
      turn: state.turn,
      castlingRights: nextState.castlingRights,
      enPassantSquare: null,
      halfmoveClock: nextState.halfmoveClock,
      fullmoveNumber: nextState.fullmoveNumber,
      move,
    });
  }

  /* ================= NORMAL MOVE ================= */

  if (!isLegalMove(from, to, state.board, state.turn, state.enPassantSquare)) return null;

  nextState.board[to] = piece;
  nextState.board[from] = null;

  /* ================= EN PASSANT ================= */

  if (piece.type === "pawn" && to === state.enPassantSquare) {
    const dir = piece.color === "white" ? -1 : 1;
    const capturedSquare = to[0] + (Number(to[1]) + dir);

    move.captured = state.board[capturedSquare];
    move.special = "en-passant";
    nextState.board[capturedSquare] = null;
  }

  /* ================= STATE UPDATES ================= */

  nextState.castlingRights = updateCastlingRights(nextState.castlingRights, from, piece);
  nextState.halfmoveClock = updateHalfmoveClock(nextState.halfmoveClock, piece, move.captured);
  nextState.fullmoveNumber = updateFullmoveNumber(state.fullmoveNumber, state.turn);
  nextState.enPassantSquare = updateEnPassantSquare(from, to, piece, nextState.board);

  /* ================= PROMOTION ================= */

  if (isPromotionSquare(to, nextState.board)) {
    promotion = { square: to, color: piece.color };
    move.promotion = promotion;

    move.san = generateSAN(
      from,
      to,
      piece,
      state.board,
      state.turn,
      promotion,
      state.enPassantSquare
    );

    return {
      board: nextState.board,
      turn: state.turn,
      castlingRights: nextState.castlingRights,
      enPassantSquare: nextState.enPassantSquare,
      halfmoveClock: nextState.halfmoveClock,
      fullmoveNumber: nextState.fullmoveNumber,
      promotion: promotion,
      move,
      gameResult: null,
    };
  }

  /* ================= SAN + FEN ================= */

  move.san = generateSAN(
    from,
    to,
    piece,
    state.board,
    state.turn,
    null,
    state.enPassantSquare
  );

  move.fen = exportFEN({
    board: nextState.board,
    turn: enemyColor,
    castlingRights: nextState.castlingRights,
    enPassantSquare: nextState.enPassantSquare,
    halfmoveClock: nextState.halfmoveClock,
    fullmoveNumber: nextState.fullmoveNumber,
  });

  /* ================= GAME END ================= */

  const repetitionResult = getRepetitionResult(move.fen);

  const gameResult = repetitionResult
    ? { result: "draw", reason: "threefold repetition" }
    : evaluateGameEnd(nextState.turn, nextState.board, nextState.halfmoveClock);

  return {
    board: nextState.board,
    turn: enemyColor,
    castlingRights: nextState.castlingRights,
    enPassantSquare: nextState.enPassantSquare,
    halfmoveClock: nextState.halfmoveClock,
    fullmoveNumber: nextState.fullmoveNumber,
    promotion: null,
    move,
    gameResult,
  };
}

function finalizeTurn(state) {
  return {
    ...state,
    turn: state.turn === "white" ? "black" : "white",
    promotion: null,
    gameResult: null,
  };
}
