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

    gameboard.setAttribute("role", "grid");
    gameboard.setAttribute("aria-label", "Ship placement grid");
    for (let i = 1; i <= 100; i++) {
      gameboard.appendChild(this.#createBtn(i));
    }

    this.#createDialogs();

    return fragment;
  }
  #createBtn(i) {
    const coordinate = numberToCoordinate(i);
    const button = document.createElement("button");

    button.className = "board__square";
    button.type = "button";

    button.dataset.coordinate = coordinate;
    button.dataset.hasShip = "false";
    button.dataset.action = "accept-ship";

    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", `Place ship at ${coordinate}`);
    button.setAttribute("aria-selected", "false");

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

    ship.classList.add(
      "board__ship",
      `board__ship--${shipName}`,
      "board__ship--notDeployed",
      "draggable",
    );

    ship.dataset.action = "select-ship";
    ship.dataset.shipId = shipId;
    ship.dataset.shipName = shipName;

    ship.tabIndex = 0;
    ship.setAttribute("role", "button");
    ship.setAttribute(
      "aria-label",
      `${shipName.replace("-", " ")} (${shipLength} squares)`,
    );
    ship.setAttribute("aria-pressed", "false");

    for (let i = 0; i < Number(shipLength); i++) {
      const square = document.createElement("div");
      square.classList.add("board__ship__square");
      ship.append(square);
    }

    return ship;
  }
}
