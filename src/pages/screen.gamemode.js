import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";

export default class ScreenGamemode {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-gamemode");
    this.rect;
  }

  init() {
    this.main.appendChild(this.create());
  }

  create() {
    const clone = this.template.content.cloneNode(true);

    clone.querySelectorAll("button").forEach((btn) => {
      this.btnAnimation(btn);

      const video = document.createElement("video");
      video.src = swirlExplosionVideoSrc;
      video.load();

      this.videoAnimation(video, btn);
    });
    return clone;
  }

  videoAnimation(video, btn) {
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
    });
  }

  btnAnimation(btn) {
    btn.addEventListener("click", () => {
      btn.classList.remove("floating-hover");
      btn.classList.add("yeet");

      this.rect = btn.getBoundingClientRect();
    });
  }
}
