import { Move, State } from "../types";

export function createMoveSnapshot(state:State, from: string, to: string): Move {
  return {
    from,
    to,
    piece: state.board[from],
    captured: state.board[to] ?? null,
    board: state.board,

    prevCastlingRights: structuredClone(state.castlingRights),
    prevEnPassantSquare: state.enPassantSquare,
    prevHalfmoveClock: state.halfmoveClock,
    prevFullmoveNumber: state.fullmoveNumber,

    san: null,
    fen: null,
    special: null,
    promotion: null,
  };
}