import ScreenController from "../pages/screen.controller.js";
import throttle from "../utils/throttle.js";
import Player from "../components/Player.js";
import Form from "../components/Form.js";
import Move from "../components/Move.js";

export default class MainController {
  constructor() {
    this.view = new ScreenController();

    this.move = null;
    this.currentScreen = null;
    this.currentMode = null;

    this.throttledPlayCursorAnimation = throttle(
      this.view.playCursorAnimation.bind(this.view),
      500,
    );

    this.players = [];
  }

  init() {
    this.currentScreen = this.view.init();

    this.view.bindGamemodeActions(this.handler.bind(this));
  }

  handler(action, target) {
    switch (action) {
      case "cursor-animation": {
        this.throttledPlayCursorAnimation(target);
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
      case "gamemode-single":
        this.singlePlayer();
        break;
      case "submit-character-info": {
        const data = Form.getData();
        this.createPlayer(data.name, data.image);
        this.loadBufferingScreen();

        setTimeout(() => {
          this.loadPlaceShipsScreen();
        }, 5000);
        break;
      }
    }
  }

  singlePlayer() {
    const screen2 = this.loadCharacterInfoScreen();
    Form.init(screen2.querySelector("form"));

    this.currentMode = "single";
    this.view.changeScreenAnimation(this.currentScreen, screen2);
    this.currentScreen = screen2;
  }

  loadCharacterInfoScreen() {
    this.view.loadCharacterInfoScreen();
    this.view.bindCharacterInfoActions(this.handler.bind(this));
    this.move = new Move(this.view.characterInfoScreenContainer());

    return this.view.characterInfoScreenContainer();
  }

  loadBufferingScreen() {
    const screen = this.view.loadBufferingScreen();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
  }

  loadPlaceShipsScreen() {
    const screen = this.view.loadPlaceShipsScreen();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
  }

  createPlayer(name, image) {
    const player = new Player(name, "human", image);
    this.players.push(player);

    return player;
  }
}
