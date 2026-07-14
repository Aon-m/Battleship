import DialogWon from "./dialog.won.js";
import ScreenPassing from "./screen.passing.js";

export default class ScreenGameboard {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.mainTemplate = document.querySelector("#screen-gameboard");
    this.playerTemplate = document.querySelector("#component-player");

    this.clone = null;
    this.rect = null;

    this.wonDialog = null;
    this.passingScreen = null;
  }

  init(info = []) {
    this.main.appendChild(this.#create(info));

    return this.clone;
  }

  // Utilities
  updateWinner(name) {
    this.wonDialog.getWinner().textContent = name;
  }

  // Creation related methods
  #create(info) {
    const fragment = this.mainTemplate.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    this.#createComponent();

    info.forEach((player) => {
      this.clone
        .querySelector("#players")
        .appendChild(this.#createPlayer(player));
    });

    return fragment;
  }
  #createComponent() {
    this.wonDialog = new DialogWon(this.clone);
    this.wonDialog.init();

    this.passingScreen = new ScreenPassing(this.clone);
    this.passingScreen.init();
  }
  #createPlayer(info = {}) {
    const fragment = this.playerTemplate.content.cloneNode(true);

    const clone = fragment.querySelector(".player");
    const playerInfo = clone.querySelector(".player__info");

    playerInfo.querySelector(".player__name").textContent = info.name;
    playerInfo.querySelector(".player__avatar").src = info.avatar;
    this.#createGameboard(
      info.gameboard,
      clone.querySelector(".player__gameboard"),
      info.id,
    );

    return fragment;
  }
  #createGameboard(coordinates, gameboard, id) {
    for (const [key, value] of Object.entries(coordinates)) {
      gameboard.appendChild(this.#createSquare(key, value, id));
    }

    gameboard.player = id;
    gameboard.classList.add("board--enabled");
  }
  #createSquare(coordinate, hasShip, id) {
    const square = document.createElement("button");

    square.className = "board__square";
    square.type = "button";
    square.dataset.coordinate = coordinate;
    square.dataset.hasShip = "false";
    square.dataset.action = "attack-square";
    square.dataset.player = id;
    square.dataset.once = "";

    if (hasShip) square.dataset.hasShip = "true";

    return square;
  }
}
