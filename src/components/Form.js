export default class Form {
  static form = null;

  static init(form) {
    this.form = form;
    this.form.addEventListener("submit", (e) => e.preventDefault());
  }

  static getData() {
    this.setImage();
    const data = new FormData(this.form);

    return {
      name: data.get("character-name"),
      image: data.get("character-image"),
    };
  }

  static setImage() {
    document.querySelector("#character-image").value =
      document.querySelector("#current-preview").src;
  }

  static reset() {
    this.form.reset();
  }
}
