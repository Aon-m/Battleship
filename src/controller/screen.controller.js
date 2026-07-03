import ScreenGamemode from "../pages/screen.gamemode.js";
import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";
import ScreenCharacterInfo from "../pages/screen.character.js";
import bindClick from "../utils/bindClick.js";
import ScreenBuffering from "../pages/screen.buffering-screen.js";
import ScreenPlaceShips from "../pages/screen.placeships.js";
import coordinateToPosition from "../utils/coordinateToPosition.js";

export default class ScreenController {
  constructor() {
    this.gamemodeScreen = new ScreenGamemode();
    this.characterInfoScreen = new ScreenCharacterInfo();
    this.bufferingScreen = new ScreenBuffering();
    this.placeShipsScreen = new ScreenPlaceShips();
    this.isTransitioning = false;
  }

  init() {
    return this.gamemodeScreen.init();
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
      });
  }

  bindCharacterInfoActions(handler) {
    // Character Info Screen
    this.characterInfoScreenContainer()
      .querySelectorAll("button")
      .forEach((btn) => {
        bindClick(btn, () => handler(btn.dataset.action, btn));
      });
  }

  bindPlaceShipsActions(handler) {
    // Place Ships Screen
    this.placeShipsScreenContainer()
      .querySelectorAll("[data-action]")
      .forEach((element) => {
        bindClick(element, () => handler(element.dataset.action, element));
      });

    document.addEventListener("dragover", (e) =>
      handler("remove-highlights", e),
    );
  }

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
    if (e.target.closest("button")) return;
    if (e.target.closest(".container")) return;
    if (e.target.closest("form")) return;

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
  }

  loadCharacterInfoScreen() {
    this.characterInfoScreen.init();
  }

  changeScreenAnimation(screen1, screen2) {
    // screen = section
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    screen1.classList.add("expand-and-collapse");

    screen1.addEventListener(
      "animationend",
      () => {
        screen1.remove();
        screen2.style.opacity = 1;
        document.body.appendChild(screen2);
        screen2.classList.remove("hidden");
        screen2.classList.add("enter-screen");
        this.isTransitioning = false;

        screen2.addEventListener("animationend", () => {
          screen2.classList.remove("enter-screen");
        });
      },
      { once: true },
    );
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

  gamemodeScreenContainer() {
    return this.gamemodeScreen.clone;
  }

  characterInfoScreenContainer() {
    return this.characterInfoScreen.clone;
  }

  loadBufferingScreen() {
    this.bufferingScreen.init();

    return this.bufferingScreen.clone;
  }

  loadPlaceShipsScreen() {
    this.placeShipsScreen.init();

    return this.placeShipsScreen.clone;
  }

  loadShips(ships = []) {
    this.placeShipsScreen.loadShips(ships);
  }

  placeShipsScreenContainer() {
    return this.placeShipsScreen.clone;
  }

  placeShipsScreenShips() {
    return this.placeShipsScreenContainer().querySelectorAll(".board__ship");
  }

  placeShipsScreenShipsContainers() {
    return this.placeShipsScreenContainer().querySelectorAll(".drag-container");
  }

  changeShipOrientation(target) {
    target.closest(".board__ship").classList.toggle("vertical");
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
    });

    const [row, col] = coordinateToPosition(coords[0]);

    // domShip cleaning
    domShip.classList.remove("dragging");
    domShip.draggable = false;
    Object.keys(domShip.dataset).forEach((key) => {
      delete domShip.dataset[key];
    });
    domShip.style.cursor = "default";

    // Board placement
    domShip.style.position = "absolute";
    domShip.style.left = `calc(var(--size-square) * ${col})`;
    domShip.style.top = `calc(var(--size-square) * ${row})`;

    document.querySelector(".board").appendChild(domShip);
  }

  findCoord(coord) {
    return this.placeShipsScreenContainer().querySelector(
      `[data-coordinate= ${coord}]`,
    );
  }
}
