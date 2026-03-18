export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export type Piece = {
  type: PieceType;
  color: Color;
  img: string;
  value: number;
};

export type Color = "white" | "black";

export type CastlingRights = {
  white: { kingSide: boolean; queenSide: boolean };
  black: { kingSide: boolean; queenSide: boolean };
};

export type GameResult = {
  result: "checkmate" | "draw" | "win" | "loss";
  reason: string;
  winner?: Color;
} | null;

export type Material = {
  white: { pawns: number; bishops: string[]; knights: number };
  black: { pawns: number; bishops: string[]; knights: number };
} | null;

export type Promotion = {
  type?: PieceType;
  color: Color;
  img?: string;
  square?: string;
} | null;

export type Move = {
  from: string,
  to: string,
  piece: Piece | null,
  captured: Piece | null,
  board: Record<string, Piece | null>,

  prevCastlingRights: CastlingRights,
  prevEnPassantSquare: string | null,
  prevHalfmoveClock: number,
  prevFullmoveNumber: number,

  san: string | null,
  fen: string | null,
  special: string | null,
  promotion: Promotion,  
}

export type State = {
  to?: string,
  from?: string
  board: Record<string, Piece | null>,
  turn: Color,
  aiTurn: Color,
  
  castlingRights: CastlingRights
  enPassantSquare: string | null,
  halfmoveClock: number,
  fullmoveNumber: number,
  
  history: Move[],
  promotion: Promotion,
  gameResult: GameResult,
  
  redoStack: Move[], 
  resign: boolean,
}

export type CreateNextState = {
  board: Record<string, Piece | null>,
    turn: Color,
    castlingRights: CastlingRights,
    enPassantSquare: string | null,
    halfmoveClock: number,
    fullmoveNumber: number,
    promotion: Promotion,
}

export type FENData = {
  board: Record<string, Piece | null>;
  turn: Color;
  castlingRights: CastlingRights;
  enPassantSquare: string | null;
  halfmoveClock: number;
  fullmoveNumber: number;
};

export type Result ={
  board: Record<string, Piece | null>,
  turn: Color,
  aiTurn: Color,
  castlingRights: CastlingRights,
  enPassantSquare: string | null,
  halfmoveClock: number,
  fullmoveNumber: number,
  promotion: Promotion,
  gameResult: GameResult,
  move?:Move
  resign?: boolean,
}

export type Action =
  | { type: 'COMMIT_MOVE'; result: Result }
  | { type: 'PROMOTE'; piece: PieceType; color: Color; square: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'IMPORT_FEN'; fen: string }
  | { type: 'FLIP_BOARD' }
  | { type: 'resign' }
  | { type: 'RESET'; aiTurn?: Color }

  export type Mode = 'ai' | 'local'
  export type Difficulty = 8 | 12 | 14 | 18;
  export type Side = 'White' | 'Random' | 'Black'
