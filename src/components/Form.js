export default class FormView {
  static characterForm = document.querySelector("#character-form");

  static init() {
    this.characterForm.addEventListener("submit", (e) => e.preventDefault());
  }

  static getData() {
    this.setImage();
    const data = new FormData(this.characterForm);

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
    this.characterForm.reset();
  }
}
