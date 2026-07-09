import DialogWon from "./dialog.won.js";

export default class ScreenGameboard {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.mainTemplate = document.querySelector("#screen-gameboard");
    this.playerTemplate = document.querySelector("#component-player");

    this.clone = null;
    this.rect = null;

    this.wonDialog = null;
  }

  init(info = []) {
    this.main.appendChild(this.#create(info));

    return this.clone;
  }

  // Utilities
  showWonDialog() {
    this.wonDialog.showModal();
  }
  updateWinner(name) {
    console.log(this.wonDialog);
    this.wonDialog.getWinner().textContent = name;
  }
  closeWonDialog() {
    this.wonDialog.close();
  }

  // Creation related methods
  #create(info) {
    const fragment = this.mainTemplate.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    this.wonDialog = new DialogWon(this.clone);
    this.wonDialog.init();

    info.forEach((player) => {
      this.clone
        .querySelector("#players")
        .appendChild(this.#createPlayer(player));
    });

    return fragment;
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
  #createGameboard(gameboard, container, id) {
    for (const [key, value] of Object.entries(gameboard)) {
      container.appendChild(this.#createSquare(key, value, id));
    }
  }
  #createSquare(coordinate, hasShip, id) {
    const square = document.createElement("button");

    square.className = "board__square";
    square.type = "button";
    square.dataset.coordinate = coordinate;
    square.dataset.hasShip = "false";
    square.dataset.action = "attack-square";
    square.dataset.player = id;

    if (hasShip) square.dataset.hasShip = "true";

    return square;
  }
}
