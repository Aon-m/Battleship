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

    this.view.bindGamemodeActions(this.#handler.bind(this));
  }

  #handler(action, target) {
    switch (action) {
      // Animation
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

      // Move
      case "move-back":
        this.move.prev();
        break;
      case "move-forward":
        this.move.next();
        break;

      // Gamemode
      case "gamemode-single":
        this.#singlePlayer();
        break;
      case "gamemode-multi":
        this.#multiPlayer();
        break;

      // Create Player
      case "submit-character-info": {
        const data = Form.getData();
        this.currentPlayer = this.#createPlayer(data.name, data.image);
        this.#loadBufferingScreen();

        setTimeout(() => {
          this.#loadPlaceShipsScreen();
        }, 5000);
        break;
      }

      // Place Ships Screen
      case "change-all-ships-orientation": {
        this.#changeAllShipOrientation(target);
        break;
      }
      case "remove-highlights": {
        this.#removeHighlightsonExit(target);
        break;
      }
      case "reset-gameboard":
        this.#resetPlaceShipsScreen();
        break;
      case "next-player":
        this.#switchToCharacterInfoScreen();
        break;

      // Dialog Controls
      case "close-dialog":
        this.#closeDialog(target);
        break;
      case "open-dialog":
        this.#openDialog();
        break;

      // Gameplay
      case "start-game":
        this.#loadBufferingScreen();
        setTimeout(() => {
          this.#startGame();
        }, 5000);
        break;
      case "attack-square":
        this.#attackSystem(target);
        break;

      // Gameend
      case "end-game":
        this.#endGame();
        break;
      case "back-to-menu":
        this.#resetAll();
        break;
    }
  }

  // Gamemode
  #singlePlayer() {
    this.#switchToCharacterInfoScreen();

    this.currentMode = "single";

    const computer = new Computer();

    computer.init();
    computer.fillGameboard();

    this.players.push(computer);
  }
  #multiPlayer() {
    this.#switchToCharacterInfoScreen();

    this.currentMode = "multi";
  }

  // Character info screen
  #switchToCharacterInfoScreen() {
    const screen = this.#loadCharacterInfoScreen();
    Form.init(screen.querySelector("form"));

    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
  }
  #loadCharacterInfoScreen() {
    this.view.loadCharacterInfoScreen();
    this.view.bindCharacterInfoActions(this.#handler.bind(this));
    this.move = new Move(this.view.characterInfoScreenContainer());

    return this.view.characterInfoScreenContainer();
  }

  // Buffering screen
  #loadBufferingScreen() {
    const screen = this.view.loadBufferingScreen();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
  }

  // Place ships screen
  #loadPlaceShipsScreen() {
    const screen = this.view.loadPlaceShipsScreen();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    this.#placeShipsScreenFunctionality();
  }
  #placeShipsScreenFunctionality() {
    let ships = Object.values(this.currentPlayer.ships).map((ship) =>
      ship.info(),
    );
    this.view.loadShips(ships);
    this.view.bindPlaceShipsActions(this.#handler.bind(this));

    const domShips = this.view.placeShipsScreenShips();
    domShips.forEach((e) => {
      const dragAndDrop = new DragAndDrop(
        e,
        this.view.placeShipsScreenShipsContainers(),
        this.#boardSquareOnHover.bind(this),
        this.#boardSquareOnDrop.bind(this),
      );
      dragAndDrop.init();
    });
  }
  #resetPlaceShipsScreen() {
    this.currentPlayer.resetGameboard();

    const screen = this.view.loadPlaceShipsScreen();
    this.view.changeScreenNoAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    this.#placeShipsScreenFunctionality();
  }

  // Ship placement tools
  #changeAllShipOrientation(btn) {
    btn.classList.add("selected");

    document.querySelectorAll(".board__ship--notDeployed").forEach((ship) => {
      this.#changeShipOrientation(ship);
    });
  }
  #changeShipOrientation(target) {
    const ship = this.currentPlayer.findShip(target.dataset.shipId);

    if (!ship) return;

    ship.orientation =
      ship.orientation === "horizontal" ? "vertical" : "horizontal";

    this.view.changeShipOrientation(target);
  }
  #boardSquareOnHover(square, domShip) {
    if (!square || !domShip) return;
    if (this.currentSquare === square) return;
    this.currentSquare = square;

    const ship = this.currentPlayer.findShip(domShip.dataset.shipId);
    const coordinate = square.dataset.coordinate;

    const result = this.currentPlayer.gameboard.validateCoordinate(
      ship,
      ship.orientation,
      coordinate,
    );

    const coordinates = result.coords.map(([row, col]) =>
      positionToCoordinate(row, col),
    );

    this.view.removeHighlights();
    this.view.highlightSquares(result.valid, coordinates);
  }
  #removeHighlightsonExit(e) {
    const board = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".board");

    if (!board) {
      this.view.removeHighlights();
    }
  }
  #boardSquareOnDrop(square, domShip) {
    if (!square) return;
    if (square.dataset.hasShip === "true") return;

    const shipId = domShip.dataset.shipId;
    const coordinate = square.dataset.coordinate;

    const result = this.currentPlayer.placeShip(shipId, coordinate);

    if (!result) {
      this.view.removeHighlights();
      return;
    }

    const coordinates = result.map(([row, col]) =>
      positionToCoordinate(row, col),
    );

    this.view.updateBoard(coordinates, domShip);

    if (document.querySelector(".board__ship--notDeployed")) return;

    this.#openDialog();
  }

  // Utilities
  #createPlayer(name, image) {
    const player = new Player(name, "human", image);
    player.init();
    this.players.push(player);

    return player;
  }
  #findPlayer(playerId) {
    for (const player of this.players) {
      if (player.id === playerId) return player;
    }

    return null;
  }
  #getRandomId(excludedPlayer) {
    const availablePlayers = this.players.filter(
      (player) => player.id !== excludedPlayer.id,
    );

    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    return availablePlayers[randomIndex].id;
  }

  // Dialog controls
  #openDialog() {
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
  #closeDialog(target) {
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

  // Gameplay
  #startGame() {
    const screen = this.#loadGameBoards();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    if (this.currentMode === "single") this.players.reverse();

    this.gameHasStarted = true;
    this.turnSystem = new TurnSystem(this.players);
    this.winCheck = new WinCheck();

    this.#turnInit();

    setTimeout(() => {
      this.#isComputer();
    }, 5000);
  }
  #turnInit(modeCheck = false) {
    if (modeCheck === true && this.currentMode === "single") {
      this.currentPlayer = this.turnSystem.getCurrentPlayer();
      this.currentPlayer.allowedFires = 1;

      return;
    }

    this.view.enableBoard(this.currentPlayer?.id);

    this.currentPlayer = this.turnSystem.getCurrentPlayer();
    this.currentPlayer.allowedFires = 1;

    this.view.disableBoard(this.currentPlayer.id);
  }
  #changeTurn(modeCheck) {
    this.turnSystem.nextTurn();
    this.#turnInit(modeCheck);
  }
  #attackSquare(square) {
    const coordinate = square.dataset.coordinate;
    const attackedPlayer = this.#findPlayer(square.dataset.player);
    if (!attackedPlayer) return false;

    const result = attackedPlayer.gameboard.receiveAttack(coordinate);
    this.view.renderAttack(attackedPlayer.id, square);

    return { hit: result, attackedPlayer };
  }
  #attackSystem(square) {
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
        this.#isComputer();
        return;
      }

      setTimeout(() => {
        this.#changeTurn(true);
        this.#isComputer();
      }, 3000);
      return;
    }

    this.#endGame();
  }
  #isComputer() {
    if (this.currentPlayer.type !== "ai") return;

    const coordiniate = this.currentPlayer.attack();
    const square = this.view.getSquare(
      coordiniate,
      this.#getRandomId(this.currentPlayer),
    );

    this.#attackSystem(square);
  }
  #resetGame() {
    this.turnSystem = null;
    this.winCheck = null;
    this.currentPlayer = null;
    this.gameHasStarted = false;
  }
  #endGame() {
    this.gameHasStarted = false;
    this.view.updateWinner(this.currentPlayer.name);
    this.view.showWonDialog();
  }
  #resetAll() {
    this.#resetGame();

    this.move = null;
    this.currentScreen.remove();
    this.currentScreen = null;
    this.currentMode = null;
    this.players = [];
    this.currentSquare = null;

    this.init();
  }

  // Gameboard init
  #loadGameBoards() {
    const info = [];

    this.players.forEach((player) => {
      info.push(player.info());
    });

    const screen = this.view.loadGameBoardScreen(info);
    this.view.bindGameboardActions(this.#handler.bind(this));

    this.players.forEach((player) => {
      const board = this.view.findGameboard(player.id);
      if (!board) return;

      this.view.loadGameboardWithShipImages(player.gameboard.ships(), board);
    });

    return screen;
  }
}
