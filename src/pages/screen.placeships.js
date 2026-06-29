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

    const ships = this.clone.querySelector(".board__ships");
    ships;
    const gameboard = this.clone.querySelector(".board");

    for (let i = 1; i <= 100; i++) {
      gameboard.appendChild(this.createBtn(i));
    }

    return fragment;
  }

  createBtn(i) {
    const button = document.createElement("button");

    button.className = "board__square";
    button.type = "button";
    button.dataset.coordinate = numberToCoordinate(i);

    return button;
  }
}
