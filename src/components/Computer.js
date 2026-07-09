import Player from "./Player.js";
import robot from "../assets/characters/robot.png";

export default class Computer extends Player {
  constructor() {
    super("Computer", "ai", robot);

    this.availableAttacks = [];
    this.#generatePossibleAttacks();
  }

  // Utilities
  attack() {
    return this.availableAttacks.pop();
  }

  // Creation related methods
  #generatePossibleAttacks() {
    const letters = "ABCDEFGHIJ";

    for (let row = 0; row < 10; row++) {
      for (let col = 1; col <= 10; col++) {
        this.availableAttacks.push(`${letters[row]}${col}`);
      }
    }

    for (let i = this.availableAttacks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [this.availableAttacks[i], this.availableAttacks[j]] = [
        this.availableAttacks[j],
        this.availableAttacks[i],
      ];
    }
  }
}
