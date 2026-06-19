import character1 from "../assets/characters/character-1.png";
import character2 from "../assets/characters/character-2.png";
import character3 from "../assets/characters/character-3.png";
import character4 from "../assets/characters/character-4.png";
import character5 from "../assets/characters/character-5.png";
import character6 from "../assets/characters/character-6.png";
import character7 from "../assets/characters/character-7.png";

export default class ScreenCharacterInfo {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-character-info");
  }

  init(handler = null) {
    this.main.appendChild(this.create(handler));
  }

  create(handler) {
    const clone = this.template.content.cloneNode(true);
    const mover = this.move(clone);

    clone.querySelectorAll("button").forEach((btn) => {
      if (typeof handler === "function")
        btn.addEventListener("click", handler.bind(this));
    });

    clone.querySelector("#back").addEventListener("click", () => {
      mover.prev();
    });
    clone.querySelector("#forward").addEventListener("click", () => {
      mover.next();
    });

    return clone;
  }

  move(container) {
    let currentIndex = 0;

    // Elements
    const currentPreview = container.querySelector("#current-preview"),
      previousPreview = container.querySelector("#previous-preview"),
      nextPreview = container.querySelector("#next-preview");

    // Data arrays
    const previousPreviews = [
        character7,
      character1,
      character2,
      character3,
      character4,
      character5,
      character6,
    ];
    const currentPreviews = [
      character1,
      character2,
      character3,
      character4,
      character5,
      character6,
      character7,
    ];
    const nextPreviews = [
      character2,
      character3,
      character4,
      character5,
      character6,
      character7,
      character1,
    ];

    // Internal function to update content
    function update() {
      previousPreview.src = previousPreviews[currentIndex];
      currentPreview.src = currentPreviews[currentIndex];
      nextPreview.src = nextPreviews[currentIndex];
    }

    // Move forward
    function goForward() {
      currentIndex = (currentIndex + 1) % currentPreviews.length;
      update();
    }

    // Move back
    function goBack() {
      currentIndex =
        (currentIndex - 1 + currentPreviews.length) % currentPreviews.length;
      update();
    }

    // Initialize first slide
    update();

    return {
      next: goForward,
      prev: goBack,
    };
  }
}
