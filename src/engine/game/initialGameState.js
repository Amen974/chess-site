import { startP } from "../../constant";

export const initialGameState = {
  board: { ...startP },
  turn: "white",
  aiTurn: "black",

  castlingRights: {
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true },
  },
  enPassantSquare: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,

  history: [],
  promotion: null,
  gameResult: null,

  redoStack: [], 
};