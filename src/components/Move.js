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
      character1,
      character2,
      character3,
      character4,
      character5,
      character6,
      character7,
    ],
    step = 75,
  ) {
    this.container = container;
    this.animator = animator;

    this.currentIndex = 0;
    this.step = step;

    this.elements = this.bindElements();

    this.previews = previews;

    this.next = throttle(this.next.bind(this), 500);
    this.prev = throttle(this.prev.bind(this), 500);
  }

  init() {
    this.render(this.getInitialState());
  }

  next() {
    return this.update("next");
  }

  prev() {
    return this.update("prev");
  }

  async update(direction) {
    const animations = this.getAnimations(direction);

    await Promise.all(animations.map((a) => a.finished));

    const state = this.getPreviewState(
      this.currentIndex,
      direction,
      this.previews,
    );
    this.currentIndex = state.index;

    this.render(state);
  }

  render(state) {
    const e = this.elements;

    e.left.src = state.offscreenLeft;
    e.prev.src = state.previous;
    e.current.src = state.current;
    e.next.src = state.next;
    e.right.src = state.offscreenRight;
  }

  getInitialState() {
    return {
      offscreenLeft: this.previews[this.previews.length - 2],
      previous: this.previews[this.previews.length - 1],
      current: this.previews[0],
      next: this.previews[1],
      offscreenRight: this.previews[2],
    };
  }

  bindElements() {
    return {
      left: this.container.querySelector("#offscreen-preview-left"),
      prev: this.container.querySelector("#previous-preview"),
      current: this.container.querySelector("#current-preview"),
      next: this.container.querySelector("#next-preview"),
      right: this.container.querySelector("#offscreen-preview-right"),
    };
  }

  getAnimations(direction) {
    const e = this.elements;

    const map = {
      next: () => [
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
      prev: () => [
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

  getPreviewState(index, direction, previews) {
    const length = previews.length;

    const nextIndex =
      direction === "prev"
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
