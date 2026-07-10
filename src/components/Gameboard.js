import coordinateToPosition from "../utils/coordinateToPosition.js";
import positionToCoordinate from "../utils/positionToCoordinate.js";
export default class GameBoard {
  constructor(size = 10) {
    this.board = this.#createBoard(size);
    this.missedShots = [];
    this.shots = [];
  }

  // Utilities
  validateCoordinate(ship, orientation, coordinate) {
    if (orientation !== "horizontal" && orientation !== "vertical") {
      throw new Error("Invalid orientation");
    }

    const [row, col] = coordinateToPosition(coordinate);
    const coords = [];

    for (let i = 0; i < ship.length; i++) {
      let r = row;
      let c = col;

      if (orientation === "vertical") r += i;
      else c += i;

      if (
        r < 0 ||
        r >= this.board.length ||
        c < 0 ||
        c >= this.board[0].length
      ) {
        return {
          valid: false,
          coords,
        };
      }

      if (this.board[r][c] !== null) {
        return {
          valid: false,
          coords,
        };
      }

      coords.push([r, c]);
    }

    return {
      valid: true,
      coords,
    };
  }
  placeShip(ship, orientation, coordinate) {
    const { valid, coords } = this.validateCoordinate(
      ship,
      orientation,
      coordinate,
    );

    if (!valid) return false;

    for (const [r, c] of coords) {
      this.board[r][c] = ship;
    }

    return coords;
  }
  receiveAttack(coordinate) {
    const [row, col] = coordinateToPosition(coordinate);

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
  cleaned(board = this.board) {
    const coordinates = {};

    board.forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        const coordinate = positionToCoordinate(rowIndex, colIndex);

        coordinates[coordinate] = square ? square.id : null;
      });
    });

    return coordinates;
  }

  // Creation related methods
  #createBoard(size) {
    const board = Array.from({ length: size }, () => Array(size).fill(null));

    return board;
  }
}
