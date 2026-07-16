export default class Dialog {
  previousFocus = null;

  show() {
    this.previousFocus = document.activeElement;

    this.clone.showModal();

    this.clone
      .querySelector("[autofocus], button")
      ?.focus();
  }

  close() {
    this.clone.close();
    this.previousFocus?.focus();
  }
}