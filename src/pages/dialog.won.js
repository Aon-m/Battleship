import Dialog from "../components/Dialog.js";
export default class DialogWon extends Dialog {
  constructor(container) {
    super();

    this.container = container;
    this.template = document.querySelector("#dialog-won");

    this.clone = null;
  }

  init() {
    this.container.appendChild(this.#create());
    this.#preventEscape();

    return this.clone;
  }

  // Utilities
  getWinner() {
    return this.clone.querySelector("#winning-player-name");
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
  #preventEscape() {
    this.clone.addEventListener("cancel", (e) => {
      e.preventDefault();
    });
  }
}
