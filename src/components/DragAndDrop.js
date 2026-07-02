export default class DragAndDrop {
  static activeElement = null;

  constructor(element, containers, onHover = () => {}, onDrop = () => {}) {
    this.element = element;
    this.containers = containers;

    this.onHover = onHover;
    this.onDrop = onDrop;

    this.boundDragStart = this.#dragStart.bind(this);
    this.boundDragEnd = this.#dragEnd.bind(this);
    this.boundDragOver = this.#dragOver.bind(this);
    this.boundDrop = this.#drop.bind(this);

    this.lastSuqare = null;
  }

  init() {
    this.dragElement();
  }

  dragElement() {
    this.element.draggable = true;

    this.element.addEventListener("dragstart", this.boundDragStart);
    this.element.addEventListener("dragend", this.boundDragEnd);

    this.containers.forEach((container) => {
      container.addEventListener("dragover", this.boundDragOver);
      container.addEventListener("drop", this.boundDrop);
    });
  }

  #dragStart() {
    this.activeElement = this.element;
    this.element.classList.add("dragging");
  }

  #dragEnd() {
    this.activeElement = null;
    this.element.classList.remove("dragging");
    this.onHover(null);
  }

  #dragOver(e) {
    if (this.activeElement !== this.element) return;
    e.preventDefault();

    const square = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".board__square");

    if (square === this.lastSquare) return;

    this.lastSquare = square;

    this.onHover(square, this.element, e);
  }

  #drop(e) {
    e.preventDefault();

    const square = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".board__square");

    this.onDrop(square, this.element, e);
  }
}
