import toNumber from "../utils/toNumber.js";

export default class Ship {
  constructor(length) {
    this.length = this.#set("length", length, 1);
    this.id = crypto.randomUUID();
    this.hits = 0;
    this.sunk = false;
  }

  // Utilities
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }

  // Internal logic
  #set(field, value, fallback) {
    value = toNumber(value);

    return this.#isValid(field, value) ? value : fallback;
  }
  #isValid(key, value) {
    switch (key) {
      case "length":
        return typeof value === "number";

      default:
        return false;
    }
  }
}
