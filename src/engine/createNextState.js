export function createNextState(state) {
  return {
    board: { ...state.board },
    turn: state.turn,
    castlingRights: structuredClone(state.castlingRights),
    enPassantSquare: null,
    halfmoveClock: state.halfmoveClock,
    fullmoveNumber: state.fullmoveNumber,
  };
}