import ScreenController from "./screen.controller.js";
import throttle from "../utils/throttle.js";
import Player from "../components/Player.js";
import Form from "../components/Form.js";
import Move from "../components/Move.js";
import DragAndDrop from "../components/DragAndDrop.js";
import positionToCoordinate from "../utils/positionToCoordinate.js";
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
    this.currentPlayer = null;
    this.currentSquare = null;
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
        this.currentPlayer = this.createPlayer(data.name, data.image);
        this.loadBufferingScreen();

        setTimeout(() => {
          this.loadPlaceShipsScreen();
        }, 5000);
        break;
      }
      case "change-all-ships-orientation": {
        this.changeAllShipOrientation(target);
        break;
      }
      case "remove-highlights": {
        this.removeHighlightsonExit(target);
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

    let ships = Object.values(this.players[0].ships).map((ship) =>
      this.extractShipInfo(ship),
    );
    this.view.loadShips(ships);
    this.view.bindPlaceShipsActions(this.handler.bind(this));

    const domShips = this.view.placeShipsScreenShips();
    domShips.forEach((e) => {
      const dragAndDrop = new DragAndDrop(
        e,
        this.view.placeShipsScreenShipsContainers(),
        this.boardSquareOnHover.bind(this),
        this.boardSquareOnDrop.bind(this),
      );
      dragAndDrop.init();
    });
  }

  extractShipInfo(ship) {
    return { name: ship.name, id: ship.ship.id, length: ship.ship.length };
  }

  createPlayer(name, image) {
    const player = new Player(name, "human", image);
    this.players.push(player);

    return player;
  }

  changeAllShipOrientation(btn) {
    btn.classList.add("selected");

    document.querySelectorAll(".board__ship--notDeployed").forEach((ship) => {
      this.changeShipOrientation(ship);
    });
  }

  changeShipOrientation(target) {
    target.dataset.shipOrientation =
      target.dataset.shipOrientation === "horizontal"
        ? "vertical"
        : "horizontal";
    this.view.changeShipOrientation(target);
  }

  boardSquareOnHover(square, domShip) {
    if (!square || !domShip) return;
    if (this.currentSquare === square) return;
    this.currentSquare = square;

    const shipId = domShip.dataset.shipId;
    const shipOrientation = domShip.dataset.shipOrientation;
    const coordinate = square.dataset.coordinate;
    const ship = this.findShip(shipId).ship;

    const result = this.currentPlayer.gameboard.validateCoordinate(
      ship,
      shipOrientation,
      coordinate,
    );

    const coordinates = result.coords.map(([row, col]) =>
      positionToCoordinate(row, col),
    );

    this.view.removeHighlights();
    this.view.highlightSquares(result.valid, coordinates);
  }

  removeHighlightsonExit(e) {
    const board = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".board");

    if (!board) {
      this.view.removeHighlights();
    }
  }

  findShip(shipId) {
    for (const player of this.players) {
      for (const shipData of Object.values(player.ships)) {
        if (shipData.ship.id === shipId) {
          return {
            player,
            shipData,
            ship: shipData.ship,
          };
        }
      }
    }

    return null;
  }

  boardSquareOnDrop(square, domShip) {
    const shipId = domShip.dataset.shipId;
    const shipOrientation = domShip.dataset.shipOrientation;
    const coordinate = square.dataset.coordinate;
    const ship = this.findShip(shipId).ship;

    const result = this.currentPlayer.gameboard.placeShip(
      ship,
      shipOrientation,
      coordinate,
    );

    if (!result) {
      this.view.removeHighlights();
      return;
    }

    const coordinates = result.map(([row, col]) =>
      positionToCoordinate(row, col),
    );

    this.view.updateBoard(coordinates, domShip);
  }
}
