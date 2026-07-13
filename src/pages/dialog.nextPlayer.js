export default class DialogReady {
  constructor(container) {
    this.container = container;
    this.template = document.querySelector("#dialog-nextPlayer");

    this.clone = null;
  }

  // Utilities
  init() {
    this.container.appendChild(this.#create());

    return this.clone;
  }
  show() {
    console.log(this.clone);
    console.log(this.clone.open);
    console.log(this.clone.matches(":modal"));

    this.clone.showModal();

    console.log(this.clone.open);
    console.log(this.clone.matches(":modal"));
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
