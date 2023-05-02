import { registerCommand } from '../src/commands.js';

const output = document.getElementById('output');
registerCommand('clear', 'Clears the terminal.', () => {
    output.innerHTML = '';
});