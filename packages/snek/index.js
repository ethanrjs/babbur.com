import { print, println } from "src/terminal.js";
import { registerCommand } from "src/commands.js";

const input = document.getElementById("input");
const output = document.getElementById("output");
const width = 8;
const height = 8;

let snake;
let food;
let direction;
let gameOver;

function clear() {
    output.innerHTML = ""
}
function startSnakeGame() {
    snake = [{ x: width / 2, y: height / 2 }];
    direction = "D";
    gameOver = false;
    spawnFood();
    update();
}

function spawnFood() {
    while (!food || snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
        food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
    }
}

function update() {
    if (!gameOver) {
        const head = { ...snake[0] };

        if (direction === "W") head.y--;
        if (direction === "A") head.x--;
        if (direction === "S") head.y++;
        if (direction === "D") head.x++;

        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
            gameOver = true;
            println("Game over! Press 'R' to restart and Q to quit".red);
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            spawnFood();
        } else {
            snake.pop();
        }

        draw();
        setTimeout(update, 200);
    }
}

function draw() {
    let output = "";
    clear()
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const isFood = x === food.x && y === food.y;
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);

            if (isFood) {
                output += "AA".red;
            } else if (isSnake) {
                output += "██".green;
            } else {
                output += "..".gray;
            }
        }
        output += "\n";
    }

    println(output);
    // scroll down
    document.body.scrollTop = document.body.scrollHeight;
}

input.addEventListener("keydown", (event) => {
    if (event.key.toUpperCase() === "W" || event.key.toUpperCase() === "A" || event.key.toUpperCase() === "S" || event.key.toUpperCase() === "D") {
        direction = event.key.toUpperCase();
    } else if (event.key.toUpperCase() === "R" && gameOver) {
        startSnakeGame();
    } else if (event.key.toUpperCase() === "Q" && gameOver) {
        println("Quitting...".red);
        gameOver = false;
        clear();
    }
});

registerCommand("snek", "Play the snake game", () => {
    startSnakeGame();
});