import GameBoard from "./Gameboard.js";

export default class Player {
  constructor(name = "Nameless", type = "Human", avatar = "", size = 10) {
    this.name = name;
    this.type = type;
    this.avatar = avatar;
    this.gameboard = new GameBoard(size);
  }
}
