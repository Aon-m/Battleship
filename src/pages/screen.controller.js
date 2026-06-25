import ScreenGamemode from "./screen.gamemode.js";
import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";
import ScreenCharacterInfo from "./screen.character.js";
import bindClick from "../utils/bindClick.js";

export default class ScreenController {
  constructor() {
    this.gamemodeScreen = new ScreenGamemode();
    this.characterInfoScreen = new ScreenCharacterInfo();
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
        bindClick(btn, () => handler(btn.dataset.action, btn));
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

  loadCharacterInfoScreen(handler) {
    this.characterInfoScreen.init(handler);
  }

  changeScreenAnimation(screen1, screen2) {
    // screen = section
    screen1.classList.add("expand-and-collapse");
    screen1.addEventListener(
      "animationend",
      () => {
        screen1.remove();
        document.body.appendChild(screen2);
        screen2.classList.remove("hidden");
        screen2.classList.add("enter-screen");
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
}
