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

    this.ships = {
      carrier: this.#createShip("carrier", 5),
      battleship: this.#createShip("battleship", 4),
      cruiser: this.#createShip("cruiser", 3),
      submarine: this.#createShip("submarine", 3),
      destroyer: this.#createShip("destroyer", 2),
    };
  }

  // Utilities
  fillGameboard() {
    const letters = "ABCDEFGHIJ";

    for (const shipData of Object.values(this.ships)) {
      const placements = [];

      const length = shipData.ship.length;

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
        const result = this.gameboard.placeShip(
          shipData.ship,
          orientation,
          coordinate,
        );

        if (result) break;
      }
    }
  }
  resetGameboard() {
    this.gameboard = new GameBoard(this.size);
  }

  // Creation related methods
  #createShip(name, length, orientation = "horizontal") {
    return {
      ship: new Ship(length),
      name,
      orientation,
      placed: false,
      position: null,
    };
  }
  #validName(name, fallback) {
    if (name.trim() === "") return fallback;
    if (!name) return fallback;

    return name;
  }
}
