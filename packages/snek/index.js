import { print, println } from "src/terminal.js";
import { registerCommand } from "src/commands.js";

const input = document.getElementById("input");
const output = document.getElementById("output");
const width = 16;
const height = 16;

let snake;
let food;
let direction;
let gameOver;

let isPlaying = false;
function clear() {
    output.innerHTML = ""
}
function startSnakeGame() {
    snake = [{ x: width / 2, y: height / 2 }];
    direction = "D";
    gameOver = false;
    isPlaying = true;
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
    let output = "┌────────────────────────────────────┐\n".gray;
    clear()
    for (let y = 0; y < height; y++) {
        output += "│ ".gray;
        for (let x = 0; x < width; x++) {
            const isFood = x === food.x && y === food.y;
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);

            if (isFood) {
                output += "[]".red;
            } else if (isSnake) {
                output += "[]".bgGreen.green;
            } else {
                output += "~ ".blackBright;
            }
        }
        output += "│\n".gray;
    }

    output += "├────────────────────────────────────┤".gray;
    output += "\n│ ".gray;
    output += "Score: ".gray;
    output += (snake.length - 1).toString().yellow;
    output += " ".gray.repeat(32 - 8 - (snake.length - 1).toString().length) + " ";
    output += "│\n".gray;
    output += "└────────────────────────────────────┘".gray;


    println(output);
    // scroll down
    document.body.scrollTop = document.body.scrollHeight;
}

input.addEventListener("keydown", (event) => {
    if (event.key.toUpperCase() === "W" || event.key.toUpperCase() === "A" || event.key.toUpperCase() === "S" || event.key.toUpperCase() === "D") {
        // dont allow to go directly backwards
        if (direction === "W" && event.key.toUpperCase() === "S") return;
        if (direction === "A" && event.key.toUpperCase() === "D") return;
        if (direction === "S" && event.key.toUpperCase() === "W") return;
        if (direction === "D" && event.key.toUpperCase() === "A") return;
        if (!isPlaying) return;
        direction = event.key.toUpperCase();
        event.preventDefault();

    } else if (event.key.toUpperCase() === "R" && gameOver) {
        startSnakeGame();
        event.preventDefault();
    } else if (event.key.toUpperCase() === "Q" && gameOver) {
        println("Quitting...".red);
        event.preventDefault();

        gameOver = false;
        clear();
        isPlaying = false;
    }

});

registerCommand("snek", "Play the snake game", () => {
    startSnakeGame();
});