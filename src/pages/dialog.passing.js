export default class DialogPassing {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-passing");

    this.clone = null;
  }

  // Utilities
  init() {
    this.container.appendChild(this.#create());

    return this.clone;
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
}
