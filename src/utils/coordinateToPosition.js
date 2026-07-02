export default function coordinateToPosition(coordinate) {
  // coordinate = A1
  if (typeof coordinate !== "string") {
    throw new TypeError("Coordinate must be a string");
  }

  coordinate = coordinate.trim().toUpperCase();

  if (!/^[A-J](10|[1-9])$/.test(coordinate)) {
    throw new Error("Invalid coordinate");
  }

  const row = coordinate[0].charCodeAt(0) - 65;
  const col = Number(coordinate.slice(1));

  return [row, col - 1];
}
