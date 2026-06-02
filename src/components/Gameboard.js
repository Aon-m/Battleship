export default class GameBoard {
  constructor(size = 10) {
    this.board = this.#createBoard(size);
    this.missedShots = [];
  }

  #createBoard(size) {
    const board = Array.from({ length: size }, () => Array(size).fill(null));

    return board;
  }

  placeShip(ship, direction, coordinate) {
    if (direction !== "horizontal" && direction !== "vertical") {
      throw new Error("Invalid direction");
    }

    const [row, col] = this.#getCoordinate(coordinate);
    const coords = [];

    for (let i = 0; i < ship.length; i++) {
      let r = row;
      let c = col;

      if (direction === "vertical") r += i;
      else if (direction === "horizontal") c += i;
      else return false;

      //   Outa bounds
      if (r < 0 || r >= this.board.length || c < 0 || c >= this.board[0].length)
        return false;

      //   Collisions
      if (this.board[r][c] !== null) {
        return false;
      }

      coords.push([r, c]);
    }

    // Place ship
    for (const [r, c] of coords) {
      this.board[r][c] = ship;
    }

    return true;
  }

  receiveAttack(coordinate) {
    const [row, col] = this.#getCoordinate(coordinate);

    const ship = this.board[row][col];

    if (ship) {
      ship.hit();
      return true;
    }

    this.missedShots.push([row, col]);
    return false;
  }

  #getCoordinate(coordinate) {
    // coordinate = A1
    if (typeof coordinate !== "string") {
      throw new TypeError("Coordinate must be a string");
    }

    coordinate = coordinate.trim().toUpperCase();

    if (!/^[A-J](10|[1-9])$/.test(coordinate)) {
      throw new Error("Invalid coordinate");
    }

    const row = coordinate[0].charCodeAt(0) - 65;
    const col = Number(coordinate.slice(1)) - 1;

    return [row, col];
  }
}
