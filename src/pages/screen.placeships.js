import numberToCoordinate from "../utils/numberToCoordinate.js";

export default class ScreenPlaceShips {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-placeships");

    this.clone = null;
  }

  init() {
    this.main.appendChild(this.create());
    this.clone.classList.add("hidden");

    return this.clone;
  }

  create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    const gameboard = this.clone.querySelector(".board");

    for (let i = 1; i <= 100; i++) {
      gameboard.appendChild(this.createBtn(i));
    }

    const ships = this.clone.querySelector(".board__ships");
    this.clone.appendChild(ships);

    return fragment;
  }

  createBtn(i) {
    const button = document.createElement("button");

    button.className = "board__square";
    button.type = "button";
    button.dataset.coordinate = numberToCoordinate(i);

    return button;
  }

  loadShips(shipNames) {
    const container = this.clone.querySelector(".board__ships");

    shipNames.forEach((shipName) => {
      container.appendChild(this.#createShipDiv(shipName));
    });
  }

  #createShipDiv(shipName) {
    const ship = document.createElement("div");
    ship.classList.add("board__ship__container");

    const img = document.createElement("img");
    img.src = new URL(`../assets/ships/ship-${shipName}.png`, import.meta.url);
    img.classList.add("board__ship");
    img.classList.add(`board__ship--${shipName}`);
    img.alt = `${shipName}`;

    ship.appendChild(img);

    return ship;
  }
}
