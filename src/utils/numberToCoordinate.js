export default function numberToCoordinate(num) {
  const row = Math.floor((num - 1) / 10);
  const col = (num - 1) % 10;

  const letter = String.fromCharCode(65 + row);
  return `${letter}${col}`;
}
