import { applyPlayerMove } from "./applyPlayerMove";
import { exportFEN } from "./exportFEN";
import { getStockfishMove } from "./getStockfishMove";

export async function playAIMove(state){
  const fen = exportFEN({
  board: state.board,  
  turn: state.turn,
  castlingRights: state.castlingRights,
  enPassantSquare:  state.enPassantSquare,
  halfmoveClock:  state.halfmoveClock,
  fullmoveNumber: state.fullmoveNumber,
  });

  const [ai] = await Promise.all([
    getStockfishMove(fen),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);
  if (!ai?.move) return null;

  const from = ai.move.slice(0, 2);
  const to = ai.move.slice(2, 4);

  return applyPlayerMove ({from, to, state});
}