export default class GameBoard {
  constructor(size = 10) {
    this.board = this.#createBoard(size);
    this.missedShots = [];
    this.shots = [];
  }

  #createBoard(size) {
    const board = Array.from({ length: size }, () => Array(size).fill(null));

    return board;
  }

  validateCoordinate(ship, orientation, coordinate) {
    if (orientation !== "horizontal" && orientation !== "vertical") {
      throw new Error("Invalid orientation");
    }

    const [row, col] = this.#getCoordinate(coordinate);
    const coords = [];

    for (let i = 0; i < ship.length; i++) {
      let r = row;
      let c = col;

      if (orientation === "vertical") r += i;
      else if (orientation === "horizontal") c += i;
      else return false;

      //   Outa bounds
      if (
        r < 0 ||
        r >= this.board.length ||
        c < 0 ||
        c >= this.board[0].length
      ) {
        return false;
      }

      //   Collisions
      if (this.board[r][c] !== null) {
        return false;
      }

      coords.push([r, c]);
    }

    return coords;
  }

  placeShip(ship, orientation, coordinate) {
    const coords = this.validateCoordinate(ship, orientation, coordinate);

    if (!coords) return false;

    for (const [r, c] of coords) {
      this.board[r][c] = ship;
    }

    return true;
  }

  receiveAttack(coordinate) {
    const [row, col] = this.#getCoordinate(coordinate);

    if (this.shots.some(([r, c]) => r === row && c === col)) return false;

    this.shots.push([row, col]);
    const ship = this.board[row][col];

    if (ship) {
      ship.hit();
      return true;
    }

    this.missedShots.push([row, col]);
    return false;
  }

  allShipsSunk() {
    const ships = new Set();

    for (const row of this.board) {
      for (const ship of row) {
        if (ship) ships.add(ship);
      }
    }

    return [...ships].every((ship) => ship.isSunk());
  }

  reset(size = 10) {
    this.board = this.#createBoard(size);
    this.missedShots = [];
    this.shots = [];
  }

  #getCoordinate(coordinate) {
    // coordinate = A1
    if (typeof coordinate !== "string") {
      throw new TypeError("Coordinate must be a string");
    }

    coordinate = coordinate.trim().toUpperCase();

    if (!/^[A-J](10|[0-9])$/.test(coordinate)) {
      throw new Error("Invalid coordinate");
    }

    const row = coordinate[0].charCodeAt(0) - 65;
    const col = Number(coordinate.slice(1));

    return [row, col];
  }
}
