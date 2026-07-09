export default class ScreenBuffering {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-buffering");

    this.clone = null;
  }

  init() {
    this.main.appendChild(this.#create());
    this.clone.classList.add("hidden");

    return this.clone;
  }

  // Creation related methods
  #create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
