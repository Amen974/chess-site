export function undoMove(board, history, setCastlingRights, setEnPassantSquare, setHalfmoveClock, setTurn, setHistory){
  const lastMove = history.at(-1);
  if(!lastMove) return;
  
  board[lastMove.from] = board[lastMove.to]
  board[lastMove.to] = lastMove.captured ?? null

  if (lastMove.special === 'en-passant') {
    board[lastMove.to] = null
    const dir = lastMove.piece.color === "white" ? -1 : 1;
    const capturedSquare = lastMove.to[0] + (Number(lastMove.to[1]) + dir);

    board[capturedSquare] = lastMove.captured;
  }

  if (lastMove.special === 'castle-king') {
    if (lastMove.piece.color === 'white') {
      board.e1 = board.g1
      board.h1 = board.f1
      board.g1 = board.f1 = null
    } else {
      board.e8 = board.g8;
      board.h8 = board.f8;
      board.g8 = board.f8 = null;
    }
  }

  if (lastMove.special === 'castle-queen') {
    if (lastMove.piece.color === 'white') {
      board.e1 = board.c1
      board.a1 = board.d1
      board.c1 = board.d1 = null
    } else {
      board.e8 = board.c8
      board.a8 = board.d8
      board.c8 = board.d8 = null
    }
  }

  if (lastMove.promotion) {
    board[lastMove.from] = {
      type: "pawn",
      color: lastMove.piece.color,
      img: `/pieces-basic-svg/pawn-${lastMove.piece.color[0]}.svg`,
    }
    board[lastMove.to] = lastMove.captured ?? null;
  }

  setCastlingRights(lastMove.prevCastlingRights);
  setEnPassantSquare(lastMove.prevEnPassantSquare);
  setHalfmoveClock(lastMove.prevHalfmoveClock);
  setTurn(lastMove.piece.color);
  setHistory(h => h.slice(0, -1));
}