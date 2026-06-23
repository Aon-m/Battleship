import ScreenController from "../pages/screen.controller.js";

export default class MainController {
  constructor() {
    this.view = new ScreenController();
  }

  init() {
    this.view.init();

    this.view.bindStaticActions(this.handler.bind(this));
  }

  handler(action) {
    switch (action) {
      case "gamemode-single":
        this.view;
        break;
    }
  }
}
