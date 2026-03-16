import { describe, it, expect } from "vitest";
import { pawnMove } from "../engine/moveGeneration/pawn";

describe('pawnMove',()=>{
  it('should return true if the pawn move one square forward ',()=>{
    const board = {
      e2: { type: 'pawn', color: 'white' },
      e3: null,
      e4: null,
    }
    expect(pawnMove('e2', 'e3', 'white', board)).toBe(true)
  });

  it('should return true if the pawn move 2 square forward',()=>{
    const board = {
      e2: { type: 'pawn', color: 'white' },
      e3: null,
      e4: null,
    }
    expect(pawnMove('e2', 'e4', 'white', board)).toBe(true)
  });

  it('should return true if the pawn move 2 square forward',()=>{
    const board = {
      e2: { type: 'pawn', color: 'white' },
      e3: null,
      e4: {type: 'pawn', color: 'white'},
    }
    expect(pawnMove('e2', 'e4', 'white', board)).toBe(false)
  });

})