import { startP } from "../../constant";
import { State } from "../../types";

export const initialGameState: State = {
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
  resign: false,
};