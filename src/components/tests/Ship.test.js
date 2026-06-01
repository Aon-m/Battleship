import Ship from "../Ship";

test('create ship from valid input', () => {
  const ship = new Ship(3);

  expect(ship.length).toBe(3);
});

test('creates ship from string number input', () => {
  const ship = new Ship("3");

  expect(ship.length).toBe(3);
});

test('creates ship from invalid input', () => {
  const ship = new Ship("ship");

  expect(ship.length).toBe(1);
});

test('hit increases damage', () => {
  const ship = new Ship(3);

  ship.hit();

  expect(ship.hits).toBe(1);
});

test('ship sinks after enough hits', () => {
  const ship = new Ship(2);

  ship.hit();
  ship.hit();

  expect(ship.isSunk()).toBe(true);
});