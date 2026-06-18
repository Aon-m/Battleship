import ScreenGamemode from "./screen.gamemode.js";
import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";

export default class ScreenController {
  constructor() {
    this.gamemodeScreen = new ScreenGamemode();
  }

  init() {
    this.gamemodeScreen.init();
    this.playCursorAnimation();
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

  playCursorAnimation() {
    document.addEventListener("click", (e) => {
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
      }, 2000);
    });
  }
}
