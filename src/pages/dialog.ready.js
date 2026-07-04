export default class DialogReady {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-ready");

    this.clone = null;
  }

  init() {
    this.container.appendChild(this.create());

    return this.clone;
  }

  create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
