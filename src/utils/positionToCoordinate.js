export default function positionToCoordinate(row, col) {
  if (
    !Number.isInteger(row) ||
    !Number.isInteger(col) ||
    col < 0 ||
    row < 0 ||
    row > 9 ||
    col > 9
  ) {
    console.log(row, col);
    throw new Error("Invalid indices");
  }

  const letter = String.fromCharCode(row + 65);

  return `${letter}${col + 1}`;
}
