import GameBoard from "./Gameboard";

export default class Player {
  constructor(name = "Nameless", type = "Human", size = 10) {
    this.name = name;
    this.type = type;
    this.gameboard = new GameBoard(size);
  }
}
