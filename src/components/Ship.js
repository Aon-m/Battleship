import toNumber from "../utils/toNumber.js";

export default class Ship {
  constructor(length, name, orientation = "horizontal") {
    this.length = this.#set("length", length, 1);
    this.id = crypto.randomUUID();
    this.hits = 0;
    this.sunk = false;
    this.name = name;
    this.orientation = orientation;
    this.placed = false;
    this.coordinate = null;
  }

  // Utilities
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.hits >= this.length;
  }
  info() {
    return {
      name: this.name,
      id: this.id,
      length: this.length,
      orientation: this.orientation,
      coordinate: this.coordinate,
    };
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
