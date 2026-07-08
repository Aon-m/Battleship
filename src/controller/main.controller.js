import ScreenController from "./screen.controller.js";
import throttle from "../utils/throttle.js";
import Player from "../components/Player.js";
import Form from "../components/Form.js";
import Move from "../components/Move.js";
import DragAndDrop from "../components/DragAndDrop.js";
import positionToCoordinate from "../utils/positionToCoordinate.js";
import Computer from "../components/Computer.js";
import TurnSystem from "../components/TurnSystem.js";
import WinCheck from "../components/WinCheck.js";
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

    this.gameHasStarted = false;
    this.winCheck = null;
    this.turnSystem = null;
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
      case "reset-gameboard":
        this.resetPlaceShipsScreen();
        break;

      case "close-dialog":
        this.closeDialog(target);
        break;

      case "gamemode-multi":
        this.multiPlayer();
        break;

      case "next-player":
        this.switchToCharacterInfoScreen();
        break;

      case "open-dialog":
        this.openDialog();
        break;

      case "start-game":
        this.loadBufferingScreen();

        setTimeout(() => {
          this.startGame();
        }, 5000);
        break;

      case "end-game":
        this.endGame();
        break;

      case "back-to-menu":
        this.resetAll();
        break;

      case "attack-square":
        this.attackSystem(target);
        break;
    }
  }

  singlePlayer() {
    this.switchToCharacterInfoScreen();

    this.currentMode = "single";

    const computer = new Computer();
    computer.init();
    this.players.push(computer);
  }

  multiPlayer() {
    this.switchToCharacterInfoScreen();

    this.currentMode = "multi";
  }

  switchToCharacterInfoScreen() {
    const screen = this.loadCharacterInfoScreen();
    Form.init(screen.querySelector("form"));

    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
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

    this.placeShipsScreenFunctionality();
  }

  placeShipsScreenFunctionality() {
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

  resetPlaceShipsScreen() {
    this.currentPlayer.resetGameboard();

    const screen = this.view.loadPlaceShipsScreen();
    this.view.changeScreenNoAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    this.placeShipsScreenFunctionality();
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
    if (!square) return;
    if (square.dataset.hasShip === "true") return;

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

    if (document.querySelector(".board__ship--notDeployed")) return;

    this.openDialog();
  }

  openDialog() {
    if (this.currentMode === "single") {
      this.view.showReadyDialog();
      return;
    }

    if (this.players.length >= 2) {
      this.view.showReadyDialog();
      return;
    }

    this.view.showNextPlayerDialog();
  }

  closeDialog(target) {
    const dialog = target.closest(".dialog").dataset.dialog;

    if (dialog === "nextPlayer") {
      this.view.closeNextPlayerDialog();
    } else if (dialog === "ready") {
      this.view.closeReadyDialog();
    } else {
      return;
    }

    this.view.showOpenDialogBtn();
  }

  startGame() {
    const screen = this.loadGameBoards();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    if (this.currentMode === "single") this.players.reverse();

    this.gameHasStarted = true;
    this.turnSystem = new TurnSystem(this.players);
    this.winCheck = new WinCheck();

    this.turnInit();

    setTimeout(() => {
      this.isComputer();
    }, 5000);
  }

  turnInit() {
    this.view.enableBoard(
      this.cleanGameboard(this.currentPlayer?.gameboard.board),
      this.currentPlayer?.id,
    );
    this.currentPlayer = this.turnSystem.getCurrentPlayer();
    this.currentPlayer.allowedFires = 1;

    this.view.disableBoard(
      this.cleanGameboard(this.currentPlayer.gameboard.board),
      this.currentPlayer.id,
    );
  }

  changeTurn() {
    this.turnSystem.nextTurn();
    this.turnInit();
  }

  findPlayer(playerId) {
    for (const player of this.players) {
      if (player.id === playerId) return player;
    }

    return null;
  }

  #attackSquare(square) {
    const coordinate = square.dataset.coordinate;
    const attackedPlayer = this.findPlayer(square.dataset.player);
    if (!attackedPlayer) return false;

    const result = attackedPlayer.gameboard.receiveAttack(coordinate);
    this.view.renderAttack(attackedPlayer.id, square);

    return { hit: result, attackedPlayer };
  }

  attackSystem(square) {
    if (
      !this.gameHasStarted ||
      !square ||
      this.currentPlayer.allowedFires === 0 ||
      square.classList.contains("board__square--disabled") ||
      square.dataset.player === this.currentPlayer.id
    )
      return;

    this.currentPlayer.allowedFires = 0;

    const { hit, attackedPlayer } = this.#attackSquare(square);
    if (!attackedPlayer) return;

    const won = this.winCheck.checkCurrentPlayer(attackedPlayer);

    if (!won) {
      if (hit) {
        this.currentPlayer.allowedFires = 1;
        this.isComputer();
        return;
      }

      setTimeout(() => {
        this.changeTurn();
        this.isComputer();
      }, 3000);
      return;
    }

    this.endGame();
  }

  isComputer() {
    if (this.currentPlayer.type !== "ai") return;

    const coordiniate = this.currentPlayer.attack();
    const square = this.view.getSquare(
      coordiniate,
      this.getRandomId(this.currentPlayer),
    );

    this.attackSystem(square);
  }

  getRandomId(excludedPlayer) {
    const availablePlayers = this.players.filter(
      (player) => player.id !== excludedPlayer.id,
    );

    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    return availablePlayers[randomIndex].id;
  }

  resetGame() {
    this.turnSystem = null;
    this.winCheck = null;
    this.currentPlayer = null;
    this.gameHasStarted = false;
  }

  endGame() {
    this.gameHasStarted = false;
    this.view.updateWinner(this.currentPlayer.name);
    this.view.showWonDialog();
  }

  resetAll() {
    this.resetGame();

    this.move = null;
    this.currentScreen.remove();
    this.currentScreen = null;
    this.currentMode = null;
    this.players = [];
    this.currentSquare = null;

    this.init();
  }

  loadGameBoards() {
    const info = [];

    this.players.forEach((player) => {
      info.push(this.cleanInfo(player));
    });

    const screen = this.view.loadGameBoardScreen(info);
    this.view.bindGameboardActions(this.handler.bind(this));
    return screen;
  }

  cleanInfo(player) {
    return {
      name: player.name,
      id: player.id,
      type: player.type,
      avatar: player.avatar,
      gameboard: this.cleanGameboard(player.gameboard.board),
    };
  }

  cleanGameboard(board) {
    const coordinates = {};

    board.forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        const coordinate = positionToCoordinate(rowIndex, colIndex);

        coordinates[coordinate] = square ? square.id : null;
      });
    });

    return coordinates;
  }
}
