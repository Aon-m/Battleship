import ScreenController from "./screen.controller.js";
import AudioController from "./audio.controller.js";
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
    this.sfx = new AudioController();

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
    this.selectedShip = null;

    this.gameHasStarted = false;
    this.winCheck = null;
    this.turnSystem = null;

    this.sfxStart = false;
    this.throttledPlaySfx = throttle((name) => this.sfx.play(name), 500);
  }

  init() {
    this.currentScreen = this.view.init();

    this.sfx.init();

    this.view.bindHeader(this.#handler.bind(this));
    this.view.bindGamemodeActions(this.#handler.bind(this));
  }

  #handler(action, target) {
    switch (action) {
      // Audio
      case "toggle-mute":
        if (this.sfxStart === false) {
          this.sfx.backgroundInit();
          this.sfxStart === true;
        }

        this.sfx.toggleMute();
        this.view.toggleMute(target);
        break;
      case "hover-sound":
        this.sfx.play("click");
        break;

      // Animation
      case "cursor-animation": {
        const result = this.throttledPlayCursorAnimation(target);
        if (result) this.throttledPlaySfx("hit");
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
        setTimeout(() => {
          this.sfx.play("select3");
        }, 400);
        break;
      case "move-forward":
        this.move.next();
        setTimeout(() => {
          this.sfx.play("select3");
        }, 400);
        break;

      // Gamemode
      case "gamemode-single":
        this.sfx.play("stretch");
        this.#singlePlayer();
        break;
      case "gamemode-multi":
        this.sfx.play("stretch");
        this.#multiPlayer();
        break;

      // Create Player
      case "submit-character-info": {
        this.sfx.play("select3");
        const data = Form.getData();
        this.currentPlayer = this.#createPlayer(data.name, data.image);
        this.#loadBufferingScreen();

        setTimeout(() => {
          this.#loadPlaceShipsScreen();
          setTimeout(() => {
            this.sfx.play("success");
          }, 1500);
        }, 5000);
        break;
      }

      // Place Ships Screen
      case "change-all-ships-orientation": {
        this.#changeAllShipOrientation();
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
        this.#loadBufferingScreen();

        setTimeout(() => {
          this.#switchToCharacterInfoScreen();
          setTimeout(() => {
            this.sfx.play("success");
          }, 1500);
        }, 5000);
        break;
      case "randomize-gameboard":
        this.#randomizeGameboard();
        break;
      case "select-ship":
        this.#selectShip(target);
        this.sfx.play("select3");
        break;
      case "accept-ship":
        this.#acceptShip(target);
        break;
      case "remove-ship-selection":
        this.#removeShipSelection();
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
          setTimeout(() => {
            this.sfx.play("success");
          }, 1500);
        }, 5000);
        break;
      case "attack-square":
        this.#attackSystem(target);
        break;
      case "hide-passing-screen":
        this.view.hidePassingScreen();
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
    this.view.setBusy(false);

    this.view.loadCharacterInfoScreen();
    this.view.bindCharacterInfoActions(this.#handler.bind(this));
    this.move = new Move(this.view.characterInfoScreenContainer());
    this.move.init();

    return this.view.characterInfoScreenContainer();
  }

  // Buffering screen
  #loadBufferingScreen() {
    this.view.setBusy(true);

    const screen = this.view.loadBufferingScreen();
    this.view.changeScreenAnimation(this.currentScreen, screen);
    this.currentScreen = screen;
  }

  // Place ships screen
  #loadPlaceShipsScreen() {
    this.view.setBusy(false);

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
    this.currentPlayer.reset();

    const screen = this.view.loadPlaceShipsScreen();
    this.view.changeScreenNoAnimation(this.currentScreen, screen);
    this.currentScreen = screen;

    this.#placeShipsScreenFunctionality();
  }

  // Ship placement tools
  #changeAllShipOrientation() {
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
      this.sfx.play("wrong");
      return;
    }

    const coordinates = result.map(([row, col]) =>
      positionToCoordinate(row, col),
    );

    this.sfx.play("success");
    this.view.updateBoard(coordinates, domShip);
    this.view.announce(`${domShip?.shipName} placed at ${coordinate}.`);

    if (document.querySelector(".board__ship--notDeployed")) return;

    this.#openDialog();
  }
  #randomizeGameboard() {
    this.#resetPlaceShipsScreen();

    this.currentPlayer.fillGameboard();
    this.view.loadGameboardWithShipImages(
      this.currentPlayer.gameboard.ships(),
      this.view.placeShipsScreenContainer().querySelector(".board"),
    );

    // Get coordinate with ships
    const coordinates = this.currentPlayer.gameboard.info();
    const coords = [];
    for (const [key, value] of Object.entries(coordinates)) {
      if (value) coords.push(key);
    }

    this.view.updateBoard(coords, null); // Add styles to the squares with ships
    this.view.removeDomShips();

    this.view.showOpenDialogBtn();
  }
  #selectShip(domShip) {
    this.selectedShip = this.selectedShip === domShip ? null : domShip;

    this.view.selectShip(domShip);
    this.view.announce("Ship selected.");
  }
  #acceptShip(square) {
    if (!this.selectedShip) return;

    this.#boardSquareOnDrop(square, this.selectedShip);
    this.#removeShipSelection();
  }
  #removeShipSelection() {
    if (!this.selectedShip) return;

    this.selectedShip?.classList.remove("board__ship--selected");
    this.selectedShip = null;
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
    this.view.closeDialog(target);

    if (this.gameHasStarted) return;

    this.view.showOpenDialogBtn();
  }

  // Gameplay
  #startGame() {
    this.view.setBusy(false);

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
    this.view.announce(`${this.currentPlayer.name}'s turn.`);
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
        this.view.announce("Hit!");
        this.sfx.play("hit");
        this.currentPlayer.allowedFires = 1;

        setTimeout(() => {
          this.#isComputer();
        }, 2000);
        return;
      }

      this.view.announce("Miss!");
      this.sfx.play("waterSplash");
      setTimeout(() => {
        this.#changeTurn(true);

        if (this.currentMode !== "single") return this.view.showPassingScreen();

        this.#isComputer();
      }, 2000);
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
    this.sfx.play("won");
    this.view.announce(`${this.currentPlayer.name} wins!`);
  }
  #resetAll() {
    this.#resetGame();

    this.move = null;
    this.currentScreen.remove();
    this.currentScreen = null;
    this.currentMode = null;
    this.players = [];
    this.currentSquare = null;
    this.selectedShip = null;

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
