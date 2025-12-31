export function pawnAttacks(from, to, color){
  const fromFile = from[0].charCodeAt(0);
  const fromRank = Number(from[1]);
  const toFile = to[0].charCodeAt(0);
  const toRank = Number(to[1]);

  const direction = color === "white" ? 1 : -1;

  return (
    toRank === fromRank + direction &&
    Math.abs(toFile - fromFile) === 1
  );
}