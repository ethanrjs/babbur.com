import { processCommands } from "./commandParser.js";
import { commands } from "src/commands.js"

const input = document.getElementById('input');
const terminal = document.querySelector('#terminal');

let history = [];
let historyIndex = 0;
const maxHistorySize = 100;

// Call onReady for all commands that have an onReady function
Object.values(commands).forEach(command => {
    if (command.onReady) {
        command.onReady();
    }
});

input.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = input.value.trim();
        input.value = '';

        if (command.length > 0) {
            history.push(command);
            historyIndex = history.length;

            if (history.length > maxHistorySize) {
                history.shift();
            }

            await processCommands(command);
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = '';
        }
    } else if (event.key === 'Tab') {
        event.preventDefault();
        const inputValue = input.value.trim();
        const matchingCommands = Object.values(commands)
            .filter(command => command.name.startsWith(inputValue) || command.aliases.some(alias => alias.startsWith(inputValue)))
            .map(command => command.name);

        if (matchingCommands.length === 1) {
            input.value = matchingCommands[0] + ' ';
        } else if (matchingCommands.length > 1) {
            println(`$ `.gray);
            print(`${inputValue} `.white);
            println(matchingCommands.join('   ').gray);
        }
    }
    terminal.childNodes.forEach(node => {
        console.log(node.nodeType);
        if (node.nodeType === Node.TEXT_NODE) {
            terminal.removeChild(node);
        }
    });

    input.scrollIntoView(false);
});

input.addEventListener('blur', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    input.focus();
});

terminal.childNodes.forEach(node => {
    console.log(node.nodeType);
    if (node.nodeType === Node.TEXT_NODE) {
        terminal.removeChild(node);
    }
}); // dont know why i need this but it works
