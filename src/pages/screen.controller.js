import ScreenGamemode from "./screen.gamemode.js";
import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";
import ScreenCharacterInfo from "./screen.character.js";
import throttle from "../utils/throttle.js";

export default class ScreenController {
  constructor() {
    this.gamemodeScreen = new ScreenGamemode();
    this.characterInfoScreen = new ScreenCharacterInfo();
  }

  init() {
    // this.gamemodeScreen.init();
    this.characterInfoScreen.init();

    // cursor animation
    const debouncedPlayCursorAnimation = throttle(
      this.playCursorAnimation.bind(this),
      500,
    );
    document.addEventListener("click", (e) => {
      debouncedPlayCursorAnimation(e);
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

  changeScreenAnimation(screen1, screen2) {
    // screen = section
    screen1.classList.add("expand-and-collapse");
    screen1.addEventListener(
      "animationend",
      () => {
        screen1.remove();
        document.body.appendChild(screen2);
        screen2.classList.add("enter-screen");
      },
      { once: true },
    );
  }
}
