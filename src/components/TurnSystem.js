export default class TurnSystem {
  constructor(players = []) {
    this.players = players;
    this.currentTurn = 0;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
    return this.getCurrentPlayer();
  }
}
