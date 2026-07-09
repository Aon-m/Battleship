export default class DialogReady {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-ready");

    this.clone = null;
  }

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
