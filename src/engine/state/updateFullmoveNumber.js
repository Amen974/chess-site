export function updateFullmoveNumber(previousFullmoveNumber, turn) {
  return turn === "black"
    ? previousFullmoveNumber + 1
    : previousFullmoveNumber;
}