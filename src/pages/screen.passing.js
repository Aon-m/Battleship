export default class DialogPassing {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#screen-passing");

    this.clone = null;
    this.previousFocus = null;
  }

  // Utilities
  init() {
    this.container.appendChild(this.#create());
    this.hide();

    return this.clone;
  }
  show() {
    this.previousFocus = document.activeElement;

    this.clone.classList.remove("hidden");
    this.clone.style.opacity = 1;

    this.clone.querySelector("button")?.focus();
  }
  hide() {
    this.clone.classList.add("hidden");
    this.clone.style.opacity = 0;

    this.previousFocus?.focus();
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
