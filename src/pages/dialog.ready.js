import Dialog from "../components/Dialog.js";
export default class DialogReady extends Dialog {
  constructor(container) {
    super();

    this.container = container;
    this.template = document.querySelector("#dialog-ready");

    this.clone = null;
  }

  // Utilities
  init() {
    this.container.appendChild(this.#create());

    return this.clone;
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
