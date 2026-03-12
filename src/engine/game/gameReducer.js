import { applyPlayerMove } from "../applyPlayerMove";
import { generateSAN } from "../generateSAN";
import { importFEN } from "../importFEN";
import { undoMove } from "../undoMove";
import { initialGameState } from "./initialGameState";

export function gameReducer(state, action) {
  switch (action.type) {
    case "COMMIT_MOVE": {
      const { result } = action;
      return {
        ...state,
        board: result.board,
        turn: result.turn,
        castlingRights: result.castlingRights,
        enPassantSquare: result.enPassantSquare,
        halfmoveClock: result.halfmoveClock,
        fullmoveNumber: result.fullmoveNumber,
        promotion: result.promotion,
        gameResult: result.gameResult,
        history: [...state.history, result.move],
        redoStack: [],
      };
    }

    case "PROMOTE": {
      const promotedPiece = {
        type: action.piece,
        color: action.color,
        img: `/pieces-basic-svg/${action.piece}-${action.color[0]}.svg`,
      };

      const newBoard = {
        ...state.board,
        [action.square]: promotedPiece,
      };

      const lastMove = state.history[state.history.length - 1];
      const updatedMove = {
        ...lastMove,
        san: generateSAN(
          lastMove.from,
          lastMove.to,
          lastMove.piece,
          newBoard,
          action.color,
          promotedPiece,
          lastMove.prevEnPassantSquare,
          lastMove.prevCastlingRights,
        ),
      };

      return {
        ...state,
        board: newBoard,
        promotion: null,
        turn: action.color === "white" ? "black" : "white",
        history: [...state.history.slice(0, -1), updatedMove],
      };
    }

    case "UNDO": {
      const lastMove = state.history.at(-1);
      if (!lastMove) return state;

      const prev = undoMove({
        board: state.board,
        lastMove,
        castlingRights: state.castlingRights,
        enPassantSquare: state.enPassantSquare,
        halfmoveClock: state.halfmoveClock,
        fullmoveNumber: state.fullmoveNumber,
      });

      if (!prev) return state;

      return {
        ...state,
        board: prev.board,
        turn: prev.turn,
        castlingRights: prev.castlingRights,
        enPassantSquare: prev.enPassantSquare,
        halfmoveClock: prev.halfmoveClock,
        fullmoveNumber: prev.fullmoveNumber,
        history: state.history.slice(0, -1),
        redoStack: [...state.redoStack, lastMove],
        promotion: null,
        gameResult: null,
      };
    }

    case "REDO": {
      const move = state.redoStack.at(-1);
      if (!move) return state;

      const result = applyPlayerMove({ from: move.from, to: move.to, state });
      if (!result) return state;

      return {
        ...state,
        board: result.board,
        turn: result.turn,
        castlingRights: result.castlingRights,
        enPassantSquare: result.enPassantSquare,
        halfmoveClock: result.halfmoveClock,
        fullmoveNumber: result.fullmoveNumber,
        promotion: result.promotion,
        history: [...state.history, result.move],
        redoStack: state.redoStack.slice(0, -1),
      };
    }

    case "IMPORT_FEN": {
      try {
        const data = importFEN(action.fen);
        return {
          ...initialGameState,
          board: data.board,
          turn: data.turn,
          castlingRights: data.castlingRights,
          enPassantSquare: data.enPassantSquare,
          halfmoveClock: data.halfmove,
          fullmoveNumber: data.fullmove,
        };
      } catch {
        return state;
      }
    }

    case "FLIP_BOARD": {
      return {
        ...state,
        aiTurn: state.aiTurn === "white" ? "black" : "white",
      };
    }

    case "resign": {
      const winner = state.aiTurn;
      return {
        ...state,
        resign: true,
        gameResult: { result: "loss", winner, reason: "resignation" },
      };
    }

    case "RESET":
      return initialGameState;

    default:
      return state;
  }
}
