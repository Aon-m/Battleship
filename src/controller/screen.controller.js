import ScreenGamemode from "../pages/screen.gamemode.js";
import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";
import ScreenCharacterInfo from "../pages/screen.character.js";
import bindClick from "../utils/bindClick.js";
import ScreenBuffering from "../pages/screen.buffering-screen.js";
import ScreenPlaceShips from "../pages/screen.placeships.js";
import coordinateToPosition from "../utils/coordinateToPosition.js";
import ScreenGameboard from "../pages/screen.gameboard.js";
import AudioController from "./audio.controller.js";

export default class ScreenController {
  constructor() {
    this.gamemodeScreen = new ScreenGamemode();
    this.characterInfoScreen = new ScreenCharacterInfo();
    this.bufferingScreen = new ScreenBuffering();
    this.placeShipsScreen = new ScreenPlaceShips();
    this.gameboardScreen = new ScreenGameboard();

    this.main = document.querySelector(`[data-page="container"]`);
    this.isTransitioning = false;

    this.announcer = this.#createAnnouncer();
    this.sfx = new AudioController();
  }

  init() {
    return this.gamemodeScreen.init();
  }

  // Event Listeners
  bindHeader(handler) {
    if (typeof handler !== "function") return;

    // Header
    document.querySelectorAll("header [data-action]").forEach((btn) => {
      const once = btn.dataset.once !== undefined;

      bindClick(btn, () => handler(btn.dataset.action, btn), once);
    });
  }

  bindGamemodeActions(handler) {
    if (typeof handler !== "function") return;

    // Cursor animation
    bindClick(document, (e) => handler("cursor-animation", e));

    // Gamemode Screen
    this.gamemodeScreenContainer()
      .querySelectorAll("button")
      .forEach((btn) => {
        bindClick(btn, () => handler("btn-animation", btn));
        bindClick(btn, () => handler("video-animation", btn));
        bindClick(btn, () => handler(btn.dataset.action, btn), true);

        btn.addEventListener("pointerenter", () => handler("hover-sound", btn));
      });
  }

  bindCharacterInfoActions(handler) {
    if (typeof handler !== "function") return;

    // Character Info Screen
    this.characterInfoScreenContainer()
      .querySelectorAll("button")
      .forEach((btn) => {
        const once = btn.dataset.once !== undefined;

        bindClick(btn, () => handler(btn.dataset.action, btn), once);
        btn.addEventListener("pointerenter", () => handler("hover-sound", btn));
      });

    this.characterInfoScreenContainer()
      .querySelectorAll("input")
      .forEach((input) => {
        input.addEventListener("pointerenter", () =>
          handler("hover-sound", input),
        );
      });
  }
  bindPlaceShipsActions(handler) {
    if (typeof handler !== "function") return;

    // Place Ships Screen
    this.placeShipsScreenContainer()
      .querySelectorAll("[data-action]")
      .forEach((element) => {
        const once = element.dataset.once !== undefined;

        bindClick(
          element,
          () => handler(element.dataset.action, element),
          once,
        );
        element.addEventListener("pointerenter", () =>
          handler("hover-sound", element),
        );
      });

    document.addEventListener("dragover", (e) =>
      handler("remove-highlights", e),
    );

    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Escape":
        case "Delete":
        case "Backspace":
          handler("remove-ship-selection");
          break;

        case "r":
        case "R":
          handler("change-all-ships-orientation");
          break;

        case "Enter":
        case " ":
          if (document.activeElement?.dataset.action) {
            event.preventDefault();

            handler(
              document.activeElement.dataset.action,
              document.activeElement,
            );
          }
          break;
      }
    });
  }
  bindGameboardActions(handler) {
    if (typeof handler !== "function") return;

    // Gameboard Screen
    this.gameboardScreen.clone
      .querySelectorAll("[data-action]")
      .forEach((element) => {
        const once = element.dataset.once !== undefined;

        bindClick(
          element,
          () => handler(element.dataset.action, element),
          once,
        );
        element.addEventListener("pointerenter", () =>
          handler("hover-sound", element),
        );
      });
  }

  // Animations
  loadCursorAnimation() {
    const video = document.createElement("video");
    video.src = swirlExplosionVideoSrc;
    video.muted = true;
    video.loop = false;
    video.style.position = "fixed";
    video.style.maxWidth = "20rem";

    video.style.margin = 0;
    video.style.pointerEvents = "none";
    video.style.objectFit = "cover";
    video.style.mixBlendMode = "screen";

    return video;
  }
  playCursorAnimation(e) {
    if (e.target.closest("button")) return false;
    if (e.target.closest(".container")) return false;
    if (e.target.closest("form")) return false;

    const video = this.loadCursorAnimation();

    video.style.left = `${e.clientX + 10}px`;
    video.style.top = `${e.clientY + 10}px`;
    video.style.transform = "translate(-50%, -50%)";

    video.addEventListener("ended", () => {
      video.remove();
    });

    document.body.appendChild(video);
    video.play();

    //   If ended listener fails
    setTimeout(() => {
      video.classList.add("fade-out");

      setTimeout(() => {
        video.remove();
      }, 1500);
    }, 1500);

    return true;
  }
  videoAnimation(btn) {
    const video = document.createElement("video");
    video.src = swirlExplosionVideoSrc;
    video.load();

    btn.addEventListener("animationend", () => {
      const rect = this.rect;

      video.style.position = "fixed";
      video.style.left = `${rect.left + 10}px`;
      video.style.top = `${rect.top - 24}px`;
      video.style.width = `${rect.width}px`;
      video.style.height = `${rect.height}px`;

      video.style.margin = 0;
      video.style.transform = "none";
      video.style.pointerEvents = "none";
      video.style.objectFit = "cover";
      video.style.mixBlendMode = "screen";

      document.body.appendChild(video);

      requestAnimationFrame(() => {
        video.play();
      });

      setTimeout(() => {
        video.classList.add("fade-out");

        setTimeout(() => {
          video.remove();
        }, 1500);
      }, 4500);
    });
  }
  btnAnimation(btn) {
    btn.addEventListener("click", () => {
      btn.classList.remove("floating-hover");
      btn.classList.add("yeet");

      this.rect = btn.getBoundingClientRect();
    });
  }

  // Screen transitions
  changeScreenAnimation(screen1, screen2) {
    if (this.isTransitioning) {
      return Promise.resolve(false);
    }

    this.isTransitioning = true;

    return new Promise((resolve) => {
      screen1.classList.add("expand-and-collapse");

      screen1.addEventListener(
        "animationend",
        () => {
          screen1.remove();
          screen2.style.opacity = 1;
          this.main.appendChild(screen2);
          screen2.classList.remove("hidden");
          screen2.classList.add("enter-screen");

          screen2.addEventListener(
            "animationend",
            () => {
              screen2.classList.remove("enter-screen");
              this.#focusScreen(screen2);

              this.isTransitioning = false;
              resolve(true);
            },
            { once: true },
          );
        },
        { once: true },
      );
    });
  }
  changeScreenNoAnimation(screen1, screen2) {
    this.main.appendChild(screen2);
    screen1.remove();
    screen2.style.opacity = 1;
    screen2.classList.remove("hidden");

    // Accessibility
    this.#focusScreen(screen2);
  }

  // Display Screen
  loadCharacterInfoScreen() {
    this.characterInfoScreen.init();
  }
  loadBufferingScreen() {
    this.bufferingScreen.init();

    return this.bufferingScreen.clone;
  }
  loadPlaceShipsScreen() {
    this.placeShipsScreen.init();

    return this.placeShipsScreen.clone;
  }

  // Passing Screen
  hidePassingScreen() {
    this.gameboardScreen.passingScreen.hide();
  }
  showPassingScreen() {
    this.gameboardScreen.passingScreen.show();
  }

  // Dom Access
  gamemodeScreenContainer() {
    return this.gamemodeScreen.clone;
  }
  characterInfoScreenContainer() {
    return this.characterInfoScreen.clone;
  }
  placeShipsScreenContainer() {
    return this.placeShipsScreen.clone;
  }
  placeShipsScreenShips() {
    return this.placeShipsScreenContainer().querySelectorAll(
      ".board__ship--notDeployed",
    );
  }
  placeShipsScreenShipsContainers() {
    return this.placeShipsScreenContainer().querySelectorAll(".drag-container");
  }
  loadGameBoardScreen(info) {
    this.gameboardScreen.init(info);

    return this.gameboardScreen.clone;
  }
  findCoord(coord) {
    return this.placeShipsScreenContainer().querySelector(
      `[data-coordinate= ${coord}]`,
    );
  }
  getSquare(coordinate, id) {
    return this.gameboardScreen.clone.querySelector(
      `[data-coordinate = "${coordinate}"][data-player = "${id}"]`,
    );
  }

  // Dom manipulation
  changeShipOrientation(target) {
    const ship = target.closest(".board__ship");

    ship.classList.toggle("vertical");

    ship.setAttribute(
      "aria-label",
      `${ship.dataset?.shipName} ${
        ship.classList.contains("vertical") ? "vertical" : "horizontal"
      }`,
    );
  }
  highlightSquares(isValid, coords) {
    // Add new highlights
    coords.forEach((coord) => {
      const square = this.findCoord(coord);

      square.classList.add(
        isValid ? "board__square--success" : "board__square--error",
      );
    });
  }
  removeHighlights() {
    this.placeShipsScreenContainer()
      .querySelectorAll(".board__square--success, .board__square--error")
      .forEach((square) => {
        square.classList.remove(
          "board__square--success",
          "board__square--error",
        );
      });
  }
  updateBoard(coords, domShip) {
    coords.forEach((coord) => {
      const square = this.findCoord(coord);

      square.classList.remove("board__square--success", "board__square--error");
      square.classList.add("board__square--selected");

      square.dataset.hasShip = "true";

      this.#updateSquareState(square, "occupied");
    });

    if (!domShip) return;
    this.#placeDomShip(this.#cleanShip(domShip), coords[0]);
  }
  renderAttack(playerId, square) {
    if (square.dataset?.hasShip === "true") {
      square.classList.add("board__square--damaged");
      this.#updateSquareState(square, "hit");
    } else {
      square.classList.add("board__square--missed");
      this.#updateSquareState(square, "miss");
    }

    square.disabled = true;
    square.setAttribute("aria-disabled", "true");
  }
  disableBoard(id) {
    const board = this.findGameboard(id);

    board?.classList.remove("board--enabled");
    board?.classList.add("board--disabled");

    board?.querySelectorAll(".board__square").forEach((square) => {
      square.disabled = true;
      square.setAttribute("aria-disabled", "true");
    });
  }
  enableBoard(id) {
    const board = this.findGameboard(id);

    board?.classList.remove("board--disabled");
    board?.classList.add("board--enabled");

    board
      ?.querySelectorAll(
        ".board__square:not(.board__square--damaged):not(.board__square--missed)",
      )
      .forEach((square) => {
        square.disabled = false;
        square.setAttribute("aria-disabled", "false");
      });
  }
  removeDomShips() {
    document
      .querySelectorAll(".board__ship--notDeployed")
      ?.forEach((ship) => ship.remove());
  }
  selectShip(ship) {
    document.querySelectorAll(".board__ship--selected").forEach((domShip) => {
      if (domShip !== ship) {
        domShip.classList.remove("board__ship--selected");
        domShip.setAttribute("aria-pressed", "false");
      }
    });

    ship.classList.toggle("board__ship--selected");
    ship.setAttribute(
      "aria-pressed",
      ship.classList.contains("board__ship--selected"),
    );
  }
  toggleMute(btn) {
    btn.classList.toggle("button--volume--mute");
    btn.classList.toggle("button--volume--unmute");
  }

  // External Utilities
  loadShips(ships = []) {
    this.placeShipsScreen.loadShips(ships);
  }
  updateWinner(playerName) {
    this.gameboardScreen.updateWinner(playerName);
  }
  loadGameboardWithShipImages(ships, board) {
    ships?.forEach((ship) => {
      this.#placeDomShip(
        this.#createDomShip(ship.name, ship.orientation, ship.length),
        ship.coordinate,
        board,
      );
    });
  }
  findGameboard(playerId) {
    const board = document.querySelector(`.board[data-player="${playerId}"]`);
    if (board) return board;

    const square = document.querySelector(
      `.board__square[data-player="${playerId}"]`,
    );
    if (square) return square.closest(".board");

    return null;
  }
  announce(message) {
    this.announcer.textContent = "";

    requestAnimationFrame(() => {
      this.announcer.textContent = message;
    });
  }
  setBusy(isBusy) {
    this.main.setAttribute("aria-busy", isBusy);
  }

  // Dialog access
  showReadyDialog() {
    this.placeShipsScreen.readyDialog.show();
  }
  showNextPlayerDialog() {
    this.placeShipsScreen.nextPlayerDialog.show();
  }
  showWonDialog() {
    this.gameboardScreen.wonDialog.show();
  }
  showOpenDialogBtn() {
    document
      .querySelector(`[data-action= "open-dialog"]`)
      .classList.remove("hidden");
  }
  hideOpenDialogBtn() {
    document
      .querySelector(`[data-action= "open-dialog"]`)
      .classList.add("hidden");
  }
  closeDialog(target) {
    const dialog = target.closest("dialog");

    if (!dialog) return;

    dialog.close();
  }

  // Internal Helpers
  #cleanShip(domShip) {
    domShip.classList.remove(
      "dragging",
      "board__ship--notDeployed",
      "board__ship--selected",
      "draggable",
    );

    domShip.draggable = false;
    delete domShip.dataset.action;

    domShip.removeAttribute("role");
    domShip.removeAttribute("tabindex");
    domShip.removeAttribute("aria-pressed");

    const cleanShip = domShip.cloneNode(true);
    domShip.replaceWith(cleanShip);

    return cleanShip;
  }
  #createDomShip(name, orientation, length) {
    const ship = document.createElement("div");

    ship.classList.add("board__ship");
    ship.classList.add(`board__ship--${name}`);

    if (orientation === "vertical") {
      ship.classList.add("vertical");
    }

    for (let i = 0; i < Number(length); i++) {
      const square = document.createElement("div");
      square.classList.add("board__ship__square");
      ship.append(square);
    }

    return ship;
  }
  #placeDomShip(
    ship,
    coordinate,
    board = this.placeShipsScreen.clone.querySelector(".board"),
  ) {
    // coordinate = A1
    const [row, col] = coordinateToPosition(coordinate);

    // Board placement
    ship.style.position = "absolute";
    ship.style.left = `calc(var(--size-square) * ${col})`;
    ship.style.top = `calc(var(--size-square) * ${row})`;
    ship.classList.add("board__ship--preview");

    ship.style.zIndex = 1;

    board.appendChild(ship);
  }
  #createAnnouncer() {
    const announcer = document.createElement("div");

    announcer.id = "announcer";
    announcer.className = "sr-only";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");

    document.body.appendChild(announcer);

    return announcer;
  }
  #focusScreen(screen) {
    const target =
      screen.querySelector("[autofocus]") ??
      screen.querySelector("h1, h2, button, input");

    if (!target) return;

    if (target.matches("h1, h2, h3, h4, h5, h6")) {
      target.tabIndex = -1;
    }

    target.focus();
  }
  #updateSquareState(square, state) {
    switch (state) {
      case "occupied":
        square.setAttribute(
          "aria-label",
          `${square.dataset.coordinate}, occupied`,
        );
        square.setAttribute("aria-selected", "true");
        break;

      case "hit":
        square.setAttribute("aria-label", `${square.dataset.coordinate}, hit`);
        square.disabled = true;
        square.setAttribute("aria-disabled", "true");
        break;

      case "miss":
        square.setAttribute("aria-label", `${square.dataset.coordinate}, miss`);
        square.disabled = true;
        square.setAttribute("aria-disabled", "true");
        break;
    }
  }
}
