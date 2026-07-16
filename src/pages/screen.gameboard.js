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

    const players = this.clone.querySelector("#players");

    info.forEach((player) => {
      players.appendChild(this.#createPlayer(player));
    });

    players.setAttribute("role", "group");
    players.setAttribute("aria-label", "Players");

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

    clone.setAttribute("role", "region");
    clone.setAttribute("aria-labelledby", `player-${info.id}`);

    const playerInfo = clone.querySelector(".player__info");

    const name = playerInfo.querySelector(".player__name");

    name.id = `player-${info.id}`;
    name.textContent = info.name;

    const avatar = playerInfo.querySelector(".player__avatar");

    avatar.src = info.avatar;
    avatar.alt = `${info.name}'s avatar`;

    this.#createGameboard(
      info.gameboard,
      clone.querySelector(".player__gameboard"),
      info.id,
      info.name,
    );

    return fragment;
  }
  #createGameboard(coordinates, gameboard, id, name) {
    gameboard.setAttribute("role", "grid");
    gameboard.setAttribute("aria-label", `${name}'s gameboard`);

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
    square.dataset.hasShip = hasShip ? "true" : "false";
    square.dataset.action = "attack-square";
    square.dataset.player = id;

    square.setAttribute("role", "gridcell");
    square.setAttribute("aria-label", `Attack ${coordinate}`);
    square.setAttribute("aria-disabled", "false");

    return square;
  }
}
