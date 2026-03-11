import { applyPlayerMove } from "./applyPlayerMove";
import { exportFEN } from "./exportFEN";
import { getStockfishMove } from "./getStockfishMove";

const PROMOTION_MAP = { q: "queen", r: "rook", b: "bishop", n: "knight" };

export async function playAIMove(state) {
  const fen = exportFEN(state);

  const [ai] = await Promise.all([
    getStockfishMove(fen),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

  if (!ai?.from || !ai?.to) return null;

  const result = applyPlayerMove({ from: ai.from, to: ai.to, state });
  if (!result) return null;

  if (ai.isPromotion) {
    const pieceType = PROMOTION_MAP[ai.lan[4]] ?? "queen";
    const { square, color } = result.promotion;

    result.board[square] = {
      type: pieceType,
      color,
      img: `/pieces-basic-svg/${pieceType}-${color[0]}.svg`,
    };
    result.promotion = null;
  }

  return result;
}