import swirlExplosionVideoSrc from "../assets/effects/swirl-explosion.mp4";

export default class ScreenGamemode {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-gamemode");

    this.clone = null;
    this.rect = null;
  }

  init(handler = null) {
    this.main.appendChild(this.create(handler));
  }

  create(handler) {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    this.clone.querySelectorAll("button").forEach((btn) => {
      this.btnAnimation(btn);

      const video = document.createElement("video");
      video.src = swirlExplosionVideoSrc;
      video.load();
      this.videoAnimation(video, btn);

      if (typeof handler === "function")
        btn.addEventListener("click", handler.bind(this, btn.dataset.action));
    });
  
    return fragment;
  }

  // move the this.videoAnimatino(video, btn) to the controller

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
}
