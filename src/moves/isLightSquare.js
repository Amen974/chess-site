export function isLightSquare(square) {
  const file = square.charCodeAt(0) - 97; 
  const rank = Number(square[1]) - 1;
  return (file + rank) % 2 === 0;
}