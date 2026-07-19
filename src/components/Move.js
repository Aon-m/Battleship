import characters from "../data/character.json";
import character1 from "../assets/characters/character-1.png";
import character2 from "../assets/characters/character-2.png";
import character3 from "../assets/characters/character-3.png";
import character4 from "../assets/characters/character-4.png";
import character5 from "../assets/characters/character-5.png";
import character6 from "../assets/characters/character-6.png";
import character7 from "../assets/characters/character-7.png";
import MoveAnimation from "./MoveAnimation.js";
import throttle from "../utils/throttle.js";

export default class Move {
  constructor(
    container,
    animator = new MoveAnimation(),
    previews = [
      { src: character1, alt: characters[0].alt },
      { src: character2, alt: characters[1].alt },
      { src: character3, alt: characters[2].alt },
      { src: character4, alt: characters[3].alt },
      { src: character5, alt: characters[4].alt },
      { src: character6, alt: characters[5].alt },
      { src: character7, alt: characters[6].alt },
    ],
  ) {
    this.container = container;
    this.animator = animator;

    this.currentIndex = 0;
    this.elements = this.#bindElements();

    this.previews = previews;

    this.step = 75;

    this.next = throttle(this.next.bind(this), 500);
    this.prev = throttle(this.prev.bind(this), 500);
  }

  // External methods
  init() {
    this.#render(this.#getInitialState());
  }
  next() {
    return this.#update("next");
  }
  prev() {
    return this.#update("prev");
  }

  // Internal Logic
  // Dom manipulation
  async #update(direction) {
    const animations = this.#getAnimations(direction);

    await Promise.all(animations.map((a) => a.finished));

    const state = this.#getPreviewState(
      this.currentIndex,
      direction,
      this.previews,
    );
    this.currentIndex = state.index;

    this.#render(state);
  }
  #render(state) {
    const e = this.elements;

    e.left.src = state.offscreenLeft.src;
    e.left.alt = state.offscreenLeft.alt;

    e.prev.src = state.previous.src;
    e.prev.alt = state.previous.alt;

    e.current.src = state.current.src;
    e.current.alt = state.current.alt;

    e.next.src = state.next.src;
    e.next.alt = state.next.alt;

    e.right.src = state.offscreenRight.src;
    e.right.alt = state.offscreenRight.alt;
  }
  #bindElements() {
    return {
      left: this.container.querySelector("#offscreen-preview-left"),
      prev: this.container.querySelector("#previous-preview"),
      current: this.container.querySelector("#current-preview"),
      next: this.container.querySelector("#next-preview"),
      right: this.container.querySelector("#offscreen-preview-right"),
    };
  }

  // Get methods
  #getInitialState() {
    return {
      offscreenLeft: this.previews[this.previews.length - 2],
      previous: this.previews[this.previews.length - 1],
      current: this.previews[0],
      next: this.previews[1],
      offscreenRight: this.previews[2],
    };
  }
  #getAnimations(direction) {
    const e = this.elements;

    const map = {
      prev: () => [
        this.animator.moveAnimation(
          e.left,
          "offscreenToPreview",
          "next",
          this.step,
        ),
        this.animator.moveAnimation(
          e.prev,
          "previewToCurrent",
          "next",
          this.step,
        ),
        this.animator.moveAnimation(
          e.current,
          "currentToPreview",
          "next",
          this.step,
        ),
        this.animator.moveAnimation(
          e.next,
          "previewToOffscreen",
          "next",
          this.step,
        ),
      ],
      next: () => [
        this.animator.moveAnimation(
          e.prev,
          "previewToOffscreen",
          "prev",
          this.step,
        ),
        this.animator.moveAnimation(
          e.current,
          "currentToPreview",
          "prev",
          this.step,
        ),
        this.animator.moveAnimation(
          e.next,
          "previewToCurrent",
          "prev",
          this.step,
        ),
        this.animator.moveAnimation(
          e.right,
          "offscreenToPreview",
          "prev",
          this.step,
        ),
      ],
    };

    return map[direction]();
  }
  #getPreviewState(index, direction, previews) {
    const length = previews.length;

    const nextIndex =
      direction === "next"
        ? (index + 1) % length
        : (index - 1 + length) % length;

    return {
      index: nextIndex,
      offscreenLeft: previews[(nextIndex - 2 + length) % length],
      previous: previews[(nextIndex - 1 + length) % length],
      current: previews[nextIndex],
      next: previews[(nextIndex + 1) % length],
      offscreenRight: previews[(nextIndex + 2) % length],
    };
  }
}
