import GameBoard from "../Gameboard";
import Ship from "../Ship";

describe("Gameboard", () => {
  test("Board generates", () => {
    const gameboard = new GameBoard();

    expect(Array.isArray(gameboard.board)).toBe(true);
  });

  test("Places ship horizontally", () => {
    const gameboard = new GameBoard();
    const ship = new Ship(3);
    gameboard.placeShip(ship, "horizontal", "A1");

    expect(gameboard.board[0][0]).toBe(ship.id);
    expect(gameboard.board[0][1]).toBe(ship.id);
    expect(gameboard.board[0][2]).toBe(ship.id);
  });

  test("Places ship vertically", () => {
    const gameboard = new GameBoard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, "vertical", "A1");

    expect(gameboard.board[0][0]).toBe(ship.id);
    expect(gameboard.board[1][0]).toBe(ship.id);
    expect(gameboard.board[2][0]).toBe(ship.id);
  });

  test("Doesn't place ship near edge", () => {
    const gameboard = new GameBoard();
    const ship = new Ship(3);

    const result = gameboard.placeShip(ship, "horizontal", "J9");
    expect(result).toBe(false);
    expect(gameboard.board[9][0]).toBeNull();
  });

  test("Doesn't place ship near another ship", () => {
    const gameboard = new GameBoard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);

    const result1 = gameboard.placeShip(ship1, "horizontal", "A1");
    const result2 = gameboard.placeShip(ship2, "horizontal", "A1");

    expect(result1).toBe(true);
    expect(result2).toBe(false);
    expect(gameboard.board[0][0]).toBe(ship1.id);
  });
});
