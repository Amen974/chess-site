export function createMoveSnapshot(state, from, to) {
  return {
    from,
    to,
    piece: state.board[from],
    captured: state.board[to] ?? null,

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