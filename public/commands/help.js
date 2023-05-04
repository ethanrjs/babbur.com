import { registerCommand, commands, getCommandHelp } from '../src/commands.js';
import { print, println } from '../src/terminal.js';

registerCommand('help', 'Displays help for command(s)', (args) => {

    let longestCommandLen = 0;
    for (const command in commands) {
        if (command.length > longestCommandLen) {
            longestCommandLen = command.length;
        }
    }

    // sort commands object into an array and sort by command name
    const sortedCommands = Object.entries(commands).sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        } else {
            return 1;
        }
    });

    if (args.length === 0) {
        const helpText = sortedCommands.map(([command, commandObj]) => {
            const { description, aliases } = commandObj;
            const aliasText = aliases.length > 0 ? `(${aliases.join(', ')})` : 'no aliases';
            return `${command.padEnd(longestCommandLen + 10).greenBright} ${aliasText.green} - ${description.gray}`;
        }).join('\n');
        println(helpText);
        return;
    }


    const helpText = args.map(arg => getCommandHelp(arg)).join('\n\n');
    println(helpText);
}, {
    aliases: ['h']
});