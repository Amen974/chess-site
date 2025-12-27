import { PIECE_VALUE } from "./PIECE_VALUE";


export const ranks = [8,7,6,5,4,3,2,1];
export const files = ["a","b","c","d","e","f","g","h"];
export const startP = {
  a1: { img: "/pieces-basic-svg/rook-w.svg",   color: "white", type: "rook",   value: PIECE_VALUE.rook },
  h1: { img: "/pieces-basic-svg/rook-w.svg",   color: "white", type: "rook",   value: PIECE_VALUE.rook },
  b1: { img: "/pieces-basic-svg/knight-w.svg", color: "white", type: "knight", value: PIECE_VALUE.knight },
  g1: { img: "/pieces-basic-svg/knight-w.svg", color: "white", type: "knight", value: PIECE_VALUE.knight },
  c1: { img: "/pieces-basic-svg/bishop-w.svg", color: "white", type: "bishop", value: PIECE_VALUE.bishop },
  f1: { img: "/pieces-basic-svg/bishop-w.svg", color: "white", type: "bishop", value: PIECE_VALUE.bishop },
  d1: { img: "/pieces-basic-svg/queen-w.svg",  color: "white", type: "queen",  value: PIECE_VALUE.queen },
  e1: { img: "/pieces-basic-svg/king-w.svg",   color: "white", type: "king",   value: PIECE_VALUE.king },

  a8: { img: "/pieces-basic-svg/rook-b.svg",   color: "black", type: "rook",   value: PIECE_VALUE.rook },
  h8: { img: "/pieces-basic-svg/rook-b.svg",   color: "black", type: "rook",   value: PIECE_VALUE.rook },
  b8: { img: "/pieces-basic-svg/knight-b.svg", color: "black", type: "knight", value: PIECE_VALUE.knight },
  g8: { img: "/pieces-basic-svg/knight-b.svg", color: "black", type: "knight", value: PIECE_VALUE.knight },
  c8: { img: "/pieces-basic-svg/bishop-b.svg", color: "black", type: "bishop", value: PIECE_VALUE.bishop },
  f8: { img: "/pieces-basic-svg/bishop-b.svg", color: "black", type: "bishop", value: PIECE_VALUE.bishop },
  d8: { img: "/pieces-basic-svg/queen-b.svg",  color: "black", type: "queen",  value: PIECE_VALUE.queen },
  e8: { img: "/pieces-basic-svg/king-b.svg",   color: "black", type: "king",   value: PIECE_VALUE.king },

  a2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  b2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  c2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  d2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  e2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  f2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  g2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },
  h2: { img: "/pieces-basic-svg/pawn-w.svg", color: "white", type: "pawn", value: PIECE_VALUE.pawn },

  a7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  b7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  c7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  d7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  e7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  f7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  g7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
  h7: { img: "/pieces-basic-svg/pawn-b.svg", color: "black", type: "pawn", value: PIECE_VALUE.pawn },
};