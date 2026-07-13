export default class DialogWon {
  constructor(container) {
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
  show() {
    this.clone.showModal();
  }
  close() {
    this.clone.close();
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
