import Player from "./Player.js";
import robot from "../assets/characters/robot.png";

export default class Computer extends Player {
  constructor() {
    super("Computer", "ai", robot);

    this.availableAttacks = [];
    this.generatePossibleAttacks();
  }

  init() {
    this.fillGameboard();
  }

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

  generatePossibleAttacks() {
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

  attack() {
    return this.availableAttacks.pop();
  }
}
