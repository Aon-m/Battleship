export default class ScreenCharacterInfo {
  constructor() {
    this.main = document.querySelector(`[data-page="container"]`);
    this.template = document.querySelector("#screen-character-info");

    this.clone = null;
  }

  init(handler = null) {
    this.main.appendChild(this.create(handler));
  }

  create(handler) {
    const fragment = this.template.content.cloneNode(true);
    // const mover = this.move(this.clone);

    this.clone = fragment.firstElementChild;

    if (typeof handler === "function") {
      this.bindClick(this.clone.querySelector("#back"), () =>
        handler("move-back"),
      );
      this.bindClick(this.clone.querySelector("#forward"), () =>
        handler("move-forward"),
      );
    }

    return fragment;
  }

  bindClick(element, handler) {
    element.addEventListener("click", handler);
  }
}
