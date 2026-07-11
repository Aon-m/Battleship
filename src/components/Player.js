import GameBoard from "./Gameboard.js";
import Ship from "./Ship.js";

export default class Player {
  constructor(name, type = "Human", avatar = "", size = 10) {
    this.name = this.#validName(name, "Nameless");
    this.type = type;
    this.avatar = avatar;
    this.gameboard = new GameBoard(size);
    this.size = size;
    this.id = crypto.randomUUID();
    this.allowedFires = 0;

    this.ships = {};
  }

  // Utilities
  fillGameboard() {
    const letters = "ABCDEFGHIJ";

    for (const ship of Object.values(this.ships)) {
      const placements = [];

      const length = ship.length;

      // Horizontal placements
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col <= 10 - length; col++) {
          placements.push({
            orientation: "horizontal",
            coordinate: `${letters[row]}${col + 1}`,
          });
        }
      }

      // Vertical placements
      for (let row = 0; row <= 10 - length; row++) {
        for (let col = 0; col < 10; col++) {
          placements.push({
            orientation: "vertical",
            coordinate: `${letters[row]}${col + 1}`,
          });
        }
      }

      // Fisher-Yates shuffle
      for (let i = placements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [placements[i], placements[j]] = [placements[j], placements[i]];
      }

      for (const { orientation, coordinate } of placements) {
        ship.orientation = orientation;
        const result = this.placeShip(ship.id, coordinate);

        if (result) break;
      }
    }
  }
  init() {
    this.#createShips();
  }
  reset() {
    this.#resetGameboard();
    this.#createShips();
  }
  findShip(shipId) {
    for (const ship of Object.values(this.ships)) {
      if (ship.id === shipId) {
        return ship;
      }
    }

    return null;
  }
  placeShip(shipId, coordinate) {
    const ship = this.findShip(shipId);
    if (!ship || ship.placed === true) return false;

    const result = this.gameboard.placeShip(ship, ship.orientation, coordinate);

    if (!result) return false;

    ship.placed = true;
    ship.coordinate = coordinate;

    return result;
  }
  info() {
    return {
      name: this.name,
      id: this.id,
      type: this.type,
      avatar: this.avatar,
      gameboard: this.gameboard.info(),
      ships: this.gameboard.ships(),
    };
  }

  // Internal methods
  // Creation related methods
  #validName(name, fallback) {
    if (name.trim() === "") return fallback;
    if (!name) return fallback;

    return name;
  }
  #createShips() {
    this.ships = {
      carrier: new Ship(5, "carrier"),
      battleship: new Ship(4, "battleship"),
      cruiser: new Ship(3, "cruiser"),
      submarine: new Ship(3, "submarine"),
      destroyer: new Ship(2, "destroyer"),
    };
  }

  // Utility internal methods
  #resetGameboard() {
    this.gameboard = new GameBoard(this.size);
  }
}
