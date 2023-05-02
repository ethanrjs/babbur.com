import { registerCommand, commands } from '../src/commands.js';

registerCommand('help', 'Displays help information about commands.', () => {
    let helpText = 'Available commands:\n';
    for (const command in commands) {
        helpText += `${command} - ${commands[command].description}\n`;
    }
    return helpText;
});

