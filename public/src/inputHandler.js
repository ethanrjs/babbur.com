import { processCommands } from "ethix:commandParser";
import { commands } from "ethix:commands"
import { print, println, prompt } from "ethix:stdio"
import { currentDirectory } from "ethix:fs";
const input = document.getElementById('input');
const terminal = document.querySelector('#terminal');
const inputLine = document.querySelector('#input-line');
let history = [];
let historyIndex = 0;
const maxHistorySize = 100;

// Call onReady for all commands that have an onReady function

input.addEventListener('keydown', async (event) => {
    if (!prompt) return;


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
        // matchingCommands = first part of the INPUT VALUE matches any command name or alias
        const matchingCommands = Object.values(commands).filter(command => command.name.startsWith(inputValue.split(' ')[0]) || command.aliases.some(alias => alias.startsWith(inputValue.split(' ')[0])));
        if (matchingCommands.length === 1) {
            const matchedCommand = matchingCommands[0];
            // Check if there is a tab completion callback for the command
            if (matchedCommand.onTabComplete) {
                const result = matchedCommand.onTabComplete(inputValue, input.value, event);

                if (result instanceof Promise) {
                    input.value = await result;
                } else {
                    input.value = result;
                }
            } else {
                input.value = matchedCommand.name + ' ';
            }
        } else if (matchingCommands.length > 1) {
            let lastPartOfCwd = currentDirectory.split('/').pop();
            println("admin".redBright);
            print(` ${lastPartOfCwd}/`.blue);
            print(" $ ".white);
            print(`${inputValue} `.white);
            println(matchingCommands.map(command => command.name).join('   ').gray);
        }
    }

    updatePrompt()

});

input.addEventListener('blur', async () => {
    if (!prompt) return;
    await new Promise(resolve => setTimeout(resolve, 10));

    input.focus();
});

terminal.childNodes.forEach(node => {
    console.log(node.nodeType);
    if (node.nodeType === Node.TEXT_NODE) {
        terminal.removeChild(node);
    }
}); // dont know why i need this but it works

const userElem = document.getElementById('user');
const promptElem = document.getElementById('prompt');
const directory = document.getElementById('directory');

export function updatePrompt() {
    let lastPartOfCwd = currentDirectory.split('/').pop();
    let promptText = "$";
    userElem.innerText = "admin";
    directory.innerText = `${lastPartOfCwd}/ `;
    promptElem.innerHTML = promptText;
}

