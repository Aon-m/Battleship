import ScreenController from "../pages/screen.controller.js";
import Move from "../components/Move.js";
import throttle from "../utils/throttle.js";

export default class MainController {
  constructor() {
    this.view = new ScreenController();

    this.move = null;

    this.debouncedPlayCursorAnimation = throttle(
      this.view.playCursorAnimation.bind(this.view),
      500,
    );
  }

  init() {
    this.view.init();

    this.view.bindGamemodeActions(this.handler.bind(this));
  }

  handler(action, target) {
    switch (action) {
      case "cursor-animation": {
        this.debouncedPlayCursorAnimation(target);
        break;
      }
      case "btn-animation":
        this.view.btnAnimation(target);
        break;
      case "video-animation":
        this.view.videoAnimation(target);
        break;
      case "move-back":
        this.move.prev();
        break;
      case "move-forward":
        this.move.next();
        break;
    }
  }
}
