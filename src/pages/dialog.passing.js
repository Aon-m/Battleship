export default class DialogPassing {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-passing");

    this.clone = null;
  }

  init() {
    this.container.appendChild(this.#create());

    return this.clone;
  }

  // Utilities
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
}
