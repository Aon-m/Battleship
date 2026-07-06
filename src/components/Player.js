import GameBoard from "./Gameboard.js";
import Ship from "./Ship.js";

export default class Player {
  constructor(name = "Nameless", type = "Human", avatar = "", size = 10) {
    this.name = name;
    this.type = type;
    this.avatar = avatar;
    this.gameboard = new GameBoard(size);
    this.size = size;
    this.id = crypto.randomUUID();

    this.ships = {
      carrier: this.createShip("carrier", 5),
      battleship: this.createShip("battleship", 4),
      cruiser: this.createShip("cruiser", 3),
      submarine: this.createShip("submarine", 3),
      destroyer: this.createShip("destroyer", 2),
    };
  }

  createShip(name, length, orientation = "horizontal") {
    return {
      ship: new Ship(length),
      name,
      orientation,
      placed: false,
      position: null,
    };
  }

  resetGameboard() {
    this.gameboard = new GameBoard(this.size);
  }
}
