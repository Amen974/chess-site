export function handleCastle(board, color, side) {
  const next = { ...board };

  if (color === "white") {
    if (side === "king") {
      next.g1 = next.e1;
      next.f1 = next.h1;
      next.e1 = next.h1 = null;
    } else {
      next.c1 = next.e1;
      next.d1 = next.a1;
      next.e1 = next.a1 = null;
    }
  } else {
    if (side === "king") {
      next.g8 = next.e8;
      next.f8 = next.h8;
      next.e8 = next.h8 = null;
    } else {
      next.c8 = next.e8;
      next.d8 = next.a8;
      next.e8 = next.a8 = null;
    }
  }

  return next;
}