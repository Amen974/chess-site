import { describe, expect, it } from "vitest";
import { applyPlayerMove } from "../engine/applyPlayerMove";
import { gameReducer } from "../engine/game/gameReducer";
import { startP } from "../constant";

describe("applyPlayerMove", () => {
  it("should return the new state result", () => {
    const state = {
      board: {
        e3: null,
        e4: { type: "pawn", color: "white" } ,
      },
      turn: 'white',
      castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true },
      },
      enPassantSquare: null,
      halfmoveClock: 0,
      fullmoveNumber: 1,
      promotion: null,
      move: {},
      gameResult: null,
      resign: false,
      aiTurn: 'black'
    };
    const from = 'e4'
    const to = 'e3'
    const result = applyPlayerMove({from, to, state});

    expect(result).toEqual(null)
  });
});

describe("Undo", () => {
  it("should undo the move", () => {
    const state = {
      board: startP,
      turn: 'white',
      castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true },
      },
      enPassantSquare: null,
      halfmoveClock: 0,
      fullmoveNumber: 1,
      promotion: null,
      move: {},
      gameResult: null,
      resign: false,
      aiTurn: 'black',
      history: [],
      redoStack: [],
    };


    const from = 'e2'
    const to = 'e4'
    const applayMove = applyPlayerMove({from, to, state});

    const result = gameReducer(state, {type: 'COMMIT_MOVE', result: applayMove});
    const undo = gameReducer(result, {type: 'UNDO'});

    const difHistory = result.history.length - undo.history.length

    expect(difHistory).toBe(1)
    expect(undo.redoStack.length).toBe(1)
    expect(undo.board[from].type).toBe('pawn')
    expect(undo.board[from].color).toBe('white')
    expect(undo.board[to]).toBeNull()
    expect(undo.turn).toBe('white')
    expect(undo.gameResult).toBeNull()
  });
});

describe("REDO", () => {
  it("should redo the last move", () => {
    const state = {
      board: startP,
      turn: 'white',
      castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true },
      },
      enPassantSquare: null,
      halfmoveClock: 0,
      fullmoveNumber: 1,
      promotion: null,
      move: {},
      gameResult: null,
      resign: false,
      aiTurn: 'black',
      history: [],
      redoStack: [],
    };


    const from = 'e2'
    const to = 'e4'
    const applayMove = applyPlayerMove({from, to, state});

    const result = gameReducer(state, {type: 'COMMIT_MOVE', result: applayMove});
    const undo = gameReducer(result, {type: 'UNDO'});

    const redo = gameReducer(undo, {type: 'REDO'});

    expect(redo.redoStack.length).toBe(0)
    expect(redo.history.length).toBe(1)
    expect(redo.board[from]).toBeNull()
    expect(redo.board[to].type).toBe('pawn')
    expect(redo.board[to].color).toBe('white')
    expect(redo.turn).toBe('black')
    expect(redo.gameResult).toBeNull()
  });
});
