import numberToCoordinate from "../utils/numberToCoordinate.js";
import DialogReady from "./dialog.ready.js";
import DialogNextPlayer from "./dialog.nextPlayer.js";

export default class ScreenPlaceShips {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-placeships");

    this.clone = null;

    this.readyDialog = null;
    this.nextPlayerDialog = null;
  }

  init() {
    this.main.appendChild(this.#create());
    this.clone.classList.add("hidden");

    return this.clone;
  }

  // Utilities
  loadShips(ships) {
    const container = this.clone.querySelector(".board__ships");

    ships.forEach((ship) => {
      container.appendChild(
        this.#createShipDiv(ship.name, ship.id, ship.length),
      );
    });
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    const gameboard = this.clone.querySelector(".board");

    for (let i = 1; i <= 100; i++) {
      gameboard.appendChild(this.#createBtn(i));
    }

    const ships = this.clone.querySelector(".board__ships");
    this.clone.appendChild(ships);

    this.#createDialogs();

    return fragment;
  }
  #createBtn(i) {
    const button = document.createElement("button");

    button.className = "board__square";
    button.type = "button";
    button.dataset.coordinate = numberToCoordinate(i);
    button.dataset.hasShip = "false";
    button.dataset.action = "accept-ship"

    return button;
  }
  #createDialogs() {
    this.readyDialog = new DialogReady(this.clone);
    this.readyDialog.init();

    this.nextPlayerDialog = new DialogNextPlayer(this.clone);
    this.nextPlayerDialog.init();
  }
  #createShipDiv(shipName, shipId, shipLength) {
    const ship = document.createElement("div");
    ship.classList.add("board__ship");
    ship.classList.add(`board__ship--${shipName}`);
    ship.classList.add(`board__ship--notDeployed`);
    ship.classList.add(`draggable`);
    ship.dataset.action = "select-ship"

    ship.dataset.shipId = shipId;

    for (let i = 0; i < Number(shipLength); i++) {
      const square = document.createElement("div");
      square.classList.add("board__ship__square");
      ship.append(square);
    }

    return ship;
  }
}
