const game = require('./minesweeper');

test('Player does not end the game', async () => {
  const { map } = await game(4,
    function* () {
    },
    async function* (n) {
      yield { x: 1, y: 1 }
    }
  )
});

test('Player loses, Mine placement covers all neighbours', async () => {
  const { map } = await game(4,
    function* () {
      yield [2, 2]
    },
    async function* (n) {
      yield { x: -1, y: 4 }
      yield { x: 2, y: 2 }
    }
  )
  expect(map).toEqual(
    [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [0, 1, 'm', 1],
      [0, 1, 1, 1]
    ]
  )
});

test('Player wins the match', async () => {
  const { map } = await game(4,
    function* () {
      yield [0, 0]
    },
    async function* (n) {
      yield { x: 1, y: 0 }
    }
  )
  expect(map).toEqual(
    [
      ['m', 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  )
});