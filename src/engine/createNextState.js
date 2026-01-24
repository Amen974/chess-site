export function createNextState(state) {
  return {
    board: { ...state.board },
    turn: state.turn,
    castlingRights: structuredClone(state.castlingRights),
    enPassantSquare: state.enPassantSquare,
    halfmoveClock: state.halfmoveClock,
    fullmoveNumber: state.fullmoveNumber,
    promotion: state.promotion
  };
}