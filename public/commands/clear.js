import { registerCommand } from 'ethix:commands';

const output = document.getElementById('output');
registerCommand('clear', 'Clears the terminal.', () => {
    output.innerHTML = '';
});