// The following code is example interface for steps input
// and it is not part of the core functionality
//
// const prompts = require("prompts")
// const consoleStepsInterface = async function* (n) {
//     while (true)
//         yield await prompts([{
//             type: 'number',
//             name: 'x',
//             message: 'Enter x',
//             validate: (x) => (x >= n || x < 0) ? `Number in range [0..${n}]` : true
//         }, {
//             type: 'number',
//             name: 'y',
//             message: 'Enter y',
//             validate: (y) => (y >= n || y < 0) ? `Number in range [0..${n}]` : true
//         }]);
// };

// The following code is example mine locations generator function
// const mines = function* () {
//     // in actual game it should be random mine generator
//     yield [0, 0]
//     yield [1, 1]
//     yield [2, 2]
// };

// Print map function
function printMap(map) {
    map = map.map(row => row.join(" "))
    console.log(map.join("\n"))
}

// Main game function
// n - size of the map
// minesFunc - generator for mines locations
// stepFunc - generator for user actions
async function start_game(n, minesFunc, stepFunc) {
    minesFunc = minesFunc()
    stepFunc = stepFunc(n)
    console.log("Game started!");

    // variables initialization
    const map = []
    const gameMap = []
    const sequenceBuffer = []
    let maxScore = n * n
    let score = 0;

    // Map generation
    for (let i = 0; i < n; i++) {
        map[i] = [];
        map[i] = new Array(n).fill(0)
        gameMap[i] = [];
        gameMap[i] = new Array(n).fill('.')
    }

    // Mines placement and cells scores calculation
    for (let [x, y] of minesFunc) {
        maxScore--;
        map[x][y] = 'm'
        neighbors = [-1, 0, 1]
        for (let i of neighbors) {
            for (let j of neighbors) {
                if (i == 0 && j == 0) continue;
                if (x + i >= 0 && x + i < n && y + j >= 0 && y + j < n && map[x + i][y + j] != 'm') {
                    map[x + i][y + j] += 1
                }
            }
        }
    }

    // functions to check if the cell is empty, not opened and in proper range
    function isConnected(i, j) {
        return (i < n && i >= 0) && (j < n && j >= 0) && (map[i][j] != 'm') && (gameMap[i][j] == '.')
    }

    // game loop
    while (score < maxScore) {
        let input;
        //user input for coordinates
        if (sequenceBuffer.length == 0) {
            printMap(gameMap)
            input = await stepFunc.next()
            input = input.value || { end: true }
        } else {
            input = sequenceBuffer.shift()
        }
        const { end, x, y } = input
        // if user inputs 'end', the game is over
        if (end) break;
        if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x > n || y > n) continue;
        if (gameMap[x][y] != '.') continue;
        // if there is a mine, the user loses
        if (map[x][y] == 'm') {
            break;
        }
        // show map to the user
        gameMap[x][y] = map[x][y]
        score += 1;

        // add empty neigbouring cells, so they will be opened in the next iteration
        if (map[x][y] == 0) {
            if (isConnected(x + 1, y)) sequenceBuffer.push({ x: x + 1, y });
            if (isConnected(x - 1, y)) sequenceBuffer.push({ x: x - 1, y });
            if (isConnected(x, y + 1)) sequenceBuffer.push({ x, y: y + 1 });
            if (isConnected(x, y - 1)) sequenceBuffer.push({ x, y: y - 1 });
            if (isConnected(x + 1, y + 1)) sequenceBuffer.push({ x: x + 1, y: y + 1 });
            if (isConnected(x - 1, y + 1)) sequenceBuffer.push({ x: x - 1, y: y + 1 });
            if (isConnected(x + 1, y - 1)) sequenceBuffer.push({ x: x + 1, y: y - 1 });
            if (isConnected(x - 1, y - 1)) sequenceBuffer.push({ x: x - 1, y: y - 1 });
        }
    }

    console.log("Your score: " + score)
    const win = score == maxScore
    if (win) {
        console.log("Congratulations, you won!")
    } else if (score == 0) {
        console.log("Unfortunately, you got 0 points. Try again!")
    } else {
        console.log(`You got ${score} points. Want to try again?`)
    }
    console.log("Your game: ")
    printMap(gameMap)
    return { win, map, gameMap }
}


module.exports = start_game