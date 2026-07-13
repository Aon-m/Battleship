export default class DialogPassing {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#screen-passing");

    this.clone = null;
  }

  // Utilities
  init() {
    this.container.appendChild(this.#create());
    this.hide();

    return this.clone;
  }
  show() {
    this.clone.classList.remove("hidden");
  }
  hide() {
    this.clone.classList.add("hidden");
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
