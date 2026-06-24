export default class ScreenCharacterInfo {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-character-info");

    this.clone = null;
  }

  init() {
    this.main.appendChild(this.create());
  }

  create() {
    const fragment = this.template.content.cloneNode(true);
    // const mover = this.move(this.clone);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
