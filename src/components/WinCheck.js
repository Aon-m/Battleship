export default class WinCheck {
  // Utilities
  checkCurrentPlayer(player) {
    return player.gameboard.allShipsSunk();
  }
  checkAllPlayers(players) {
    return players.some((player) => this.checkCurrentPlayer(player));
  }
}
