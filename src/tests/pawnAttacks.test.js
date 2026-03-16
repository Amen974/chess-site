import { describe, it, expect } from "vitest";
import { pawnAttacks } from "../engine/moveGeneration/pawnAttacks";

describe('pawnAttack',()=>{
  it('should return true if the pawn attacks diagonally right',()=>{
    expect(pawnAttacks('e4', 'f5', 'white')).toBe(true)
  });

  it('should return true if the pawn attacks diagonally left',()=>{
    expect(pawnAttacks('e4', 'd5', 'white')).toBe(true)
  });

  it('should return false if the pawn tries to go straight forward',()=>{
    expect(pawnAttacks('e4', 'e5', 'white')).toBe(false)
  });

})