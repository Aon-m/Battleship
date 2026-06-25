export default class ScreenGamemode {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-gamemode");

    this.clone = null;
    this.rect = null;
  }

  init() {
    this.main.appendChild(this.create());

    return this.clone;
  }

  create() {
    const fragment = this.template.content.cloneNode(true);

    this.clone = fragment.firstElementChild;

    return fragment;
  }
}
