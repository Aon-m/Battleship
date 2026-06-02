import GameBoard from "../Gameboard";
import Ship from "../Ship";

describe("Gameboard", () => {
  describe("Place Ship", () => {
    test("Board generates", () => {
      const gameboard = new GameBoard();

      expect(Array.isArray(gameboard.board)).toBe(true);
    });

    test("Places ship horizontally", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);
      gameboard.placeShip(ship, "horizontal", "A1");

      expect(gameboard.board[0][0]).toBe(ship);
      expect(gameboard.board[0][1]).toBe(ship);
      expect(gameboard.board[0][2]).toBe(ship);
    });

    test("Places ship vertically", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "vertical", "A1");

      expect(gameboard.board[0][0]).toBe(ship);
      expect(gameboard.board[1][0]).toBe(ship);
      expect(gameboard.board[2][0]).toBe(ship);
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
      expect(gameboard.board[0][0]).toBe(ship1);
    });
  });

  describe("Receive Attack", () => {
    test("Hits a ship", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");
      gameboard.receiveAttack("A1");

      expect(ship.hits).toBe(1);
    });

    test("Hits the correct ship", () => {
      const gameboard = new GameBoard();
      const ship1 = new Ship(3);
      const ship2 = new Ship(3);

      gameboard.placeShip(ship1, "horizontal", "A1");
      gameboard.placeShip(ship2, "horizontal", "C1");

      gameboard.receiveAttack("C1");

      expect(ship1.hits).toBe(0);
      expect(ship2.hits).toBe(1);
    });

    test("Records a missed attack", () => {
      const gameboard = new GameBoard();

      gameboard.receiveAttack("J10");

      expect(gameboard.missedShots).toEqual([[9, 9]]);
    });

    test("Does not damage a ship on a miss", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");
      gameboard.receiveAttack("J10");

      expect(ship.hits).toBe(0);
    });

    test("Can hit different sections of the same ship", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");

      gameboard.receiveAttack("A1");
      gameboard.receiveAttack("A2");

      expect(ship.hits).toBe(2);
    });

    test("Does not count the same section of the same ship", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");

      gameboard.receiveAttack("A1");
      gameboard.receiveAttack("A1");

      expect(ship.hits).toBe(1);
    });

    test("Sinks a ship", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");

      gameboard.receiveAttack("A1");
      gameboard.receiveAttack("A2");
      gameboard.receiveAttack("A3");

      expect(ship.isSunk()).toBe(true);
    });
  });

  describe("All Ships Sunk", () => {
    test("Sinks a ship", () => {
      const gameboard = new GameBoard();
      const ship = new Ship(3);

      gameboard.placeShip(ship, "horizontal", "A1");

      gameboard.receiveAttack("A1");
      gameboard.receiveAttack("A2");
      gameboard.receiveAttack("A3");

      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });
});
