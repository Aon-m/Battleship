export default class DialogWon {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-won");

    this.clone = null;
  }

  init() {
    this.container.appendChild(this.create());
    this.preventEscape();

    return this.clone;
  }

  create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }

  getWinner() {
    return this.clone.querySelector("#winning-player-name");
  }

  preventEscape() {
    this.clone.addEventListener("cancel", (e) => {
      e.preventDefault();
    });
  }
}
