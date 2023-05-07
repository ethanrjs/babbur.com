import { registerCommand } from 'ethix:commands';
import { print, println, clear, disablePrompt, enablePrompt } from 'ethix:stdio';
import { createFile, readFile, resolvePath } from 'ethix:fs';

let editorOpen = false;
let buffer = "";
let cursor = {
    x: 0,
    y: 0
}
let openedFileName = "";
let commandMode = false;
let command = "";

registerCommand('edit', 'Edit a file', async (args) => {
    if (!args[0]) {
        println('Usage: edit <file>');
        return;
    }

    disablePrompt()
    editorOpen = true;

    const path = resolvePath(args[0]);
    let file;

    try {
        file = readFile(path);
    } catch (error) {
        file = null;
        console.log(error);
    }

    let content;
    if (file) {
        content = file;
    } else {
        createFile(path, "");
        content = ""; // Set the content to an empty string if the file doesn't exist
    }

    buffer = content;
    clear();
    openedFileName = path;

});

// Step 1: Function to draw the cursor at the current position
function drawCursor(text, longestLineOfText) {
    let line = text[cursor.y];
    let beforeCursor = line.slice(0, cursor.x);
    let afterCursor = line.slice(cursor.x);

    // Add █ to represent the cursor
    return (beforeCursor + '█' + afterCursor).padEnd(longestLineOfText + 1);
}

// Step 2: Function to handle user input and update the buffer and cursor position


function handleCommand(command) {
    if (command === "w") {
        createFile(openedFileName, buffer);
    } else if (command === "q") {
        editorOpen = false;
        buffer = "";
        cursor = {
            x: 0,
            y: 0
        }
        openedFileName = "";
        commandMode = false;
        command = "";

        enablePrompt();
        clear();
    } else if (command === "wq") {
        createFile(openedFileName, buffer);
        editorOpen = false;
        buffer = "";
        cursor = {
            x: 0,
            y: 0
        }
        openedFileName = "";
        commandMode = false;
        command = "";

        enablePrompt();
        clear();
    }
}

function handleInput(e) {
    if (!editorOpen) return;
    e.preventDefault();

    if (commandMode) {
        if (e.key === 'Enter') {
            handleCommand(command);

            command = '';
        } else if (e.key === 'Backspace') {
            command = command.slice(0, -1);
        } else if (e.key.length === 1) {
            command += e.key;
        }
        renderEditor();
        return;
    }

    if (e.key.length === 1) { // For printable characters
        const lines = buffer.split('\n');
        lines[cursor.y] = lines[cursor.y].slice(0, cursor.x) + e.key + lines[cursor.y].slice(cursor.x);
        buffer = lines.join('\n');
        cursor.x++;
    } else { // For non-printable characters (arrow keys, backspace, etc.)
        switch (e.key) {
            case 'ArrowUp':
                if (cursor.y > 0) cursor.y--;
                break;
            case 'ArrowDown':
                if (cursor.y < buffer.split('\n').length - 1) cursor.y++;
                break;
            case 'ArrowLeft':
                if (cursor.x > 0) cursor.x--;
                break;
            case 'ArrowRight':
                if (cursor.x < buffer.split('\n')[cursor.y].length) cursor.x++;
                break;
            case 'Backspace':
                const lines = buffer.split('\n');
                if (cursor.x === 0 && cursor.y !== 0) {
                    cursor.x = lines[cursor.y - 1].length;
                    lines[cursor.y - 1] += lines[cursor.y];
                    lines.splice(cursor.y, 1);
                    cursor.y--;
                } else if (cursor.x > 0) {
                    lines[cursor.y] = lines[cursor.y].slice(0, cursor.x - 1) + lines[cursor.y].slice(cursor.x);
                    cursor.x--;
                }
                buffer = lines.join('\n');
                break;
            case 'Enter':
                const lines2 = buffer.split('\n');
                lines2[cursor.y] = lines2[cursor.y].slice(0, cursor.x);
                lines2.splice(cursor.y + 1, 0, lines2[cursor.y].slice(cursor.x));
                buffer = lines2.join('\n');
                cursor.y++;
                cursor.x = 0;
                break;
            case 'Tab':
                const lines3 = buffer.split('\n');
                lines3[cursor.y] = lines3[cursor.y].slice(0, cursor.x) + "    " + lines3[cursor.y].slice(cursor.x);
                buffer = lines3.join('\n');
                cursor.x += 4;
                break;
            case 'Escape':
                commandMode = !commandMode;
                break;
            case 'Delete':
                const lines4 = buffer.split('\n');
                if (cursor.x === lines4[cursor.y].length && cursor.y !== lines4.length - 1) {
                    lines4[cursor.y] += lines4[cursor.y + 1];
                    lines4.splice(cursor.y + 1, 1);
                } else {
                    lines4[cursor.y] = lines4[cursor.y].slice(0, cursor.x) + lines4[cursor.y].slice(cursor.x + 1);
                }
                buffer = lines4.join('\n');
                break;

            default:
                break;
        }
    }

    renderEditor();
}


function renderEditor() {
    if (!editorOpen) return;
    clear();
    let output = "";

    let text = buffer.split('\n');
    let lines = text.length;

    // Ensure at least 15 lines
    while (text.length < 15) {
        text.push("");
    }

    let longestLineOfText = Math.max(90, ...text.map(line => line.length));
    let longestLineNumber = Math.max(6, String(lines).length);

    // Helper function to generate repeated strings
    function repeatString(str, count) {
        return str.repeat(count);
    }

    // Helper function to generate title bar, top, and bottom lines
    function generateLine(prefix, middle) {
        return `${prefix}${repeatString("—", longestLineNumber)}${middle}${repeatString("—", longestLineOfText + 2)}${prefix}\n`;
    }

    const titleBarTop = generateLine("+", "+");
    output += titleBarTop;

    const titleBar = `|${" File ".blue}| ${openedFileName.padEnd(longestLineOfText).blueBright} |\n`;
    output += titleBar;

    const topLine = generateLine("+", "+");
    output += topLine;

    for (let i = 0; i < lines; i++) {
        const lineNumber = (i + 1).toString().padStart(longestLineNumber);
        const lineContent = (i === cursor.y && !commandMode) ? drawCursor(text, longestLineOfText) : text[i].padEnd(longestLineOfText + 1);

        output += `|${lineNumber.yellow}|${lineContent} |\n`;
    }

    const bottomLine = generateLine("+", "+");
    output += bottomLine;

    const commandLineContent = commandMode ? command.slice(0, cursor.x) + '█' + command.slice(cursor.x) : command;
    const commandLine = `|${" ".repeat(longestLineNumber)}>${commandLineContent}${" ".repeat(longestLineOfText + 2 - commandLineContent.length)}|\n`;
    output += commandLine;

    const bottomBar = generateLine("+", "+");
    output += bottomBar;

    print(output);
}

// Step 4: Set up an event listener for keyboard input
document.addEventListener('keydown', handleInput);