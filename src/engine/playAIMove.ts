import { PieceType, State } from "../types";
import { applyPlayerMove } from "./applyPlayerMove";
import { exportFEN } from "./exportFEN";
import { getStockfishMove } from "./getStockfishMove";
import {PIECE_VALUE} from '../constant/PIECE_VALUE'

const PROMOTION_MAP: Record<string, string> = { q: "queen", r: "rook", b: "bishop", n: "knight" };

export async function playAIMove(state: State, depth = 12) {
  const fen = exportFEN(state);

  const [ai] = await Promise.all([
    getStockfishMove(fen, depth),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

  if (!ai?.from || !ai?.to) return null;

  const result = applyPlayerMove({ from: ai.from, to: ai.to, state });
  if (!result) return null;

  if (ai.isPromotion && result.promotion?.square) {
    const pieceType = PROMOTION_MAP[ai.lan[4]] ?? "queen";
    const { square, color } = result.promotion;

    result.board[square] = {
      type: pieceType as PieceType,
      color,
      img: `/pieces-basic-svg/${pieceType}-${color[0]}.svg`,
      value: PIECE_VALUE[pieceType]
    };
    result.promotion = null;
  }

  return result;
}