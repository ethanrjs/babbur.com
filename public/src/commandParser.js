import { commands } from "./commands.js";
import { print, println } from "./terminal.js";

async function processCommand(command) {
    const commandParts = command.split(' ');
    const commandName = commandParts.shift().trim();

    print(`$ `.gray);
    print(`${command} `.white);

    if (commands[commandName]) {
        const result = commands[commandName].action(commandParts);

        if (result instanceof Promise) {
            const asyncResult = await result;
            println(asyncResult);
        } else {
            println(result);
        }
    } else {
        println(`Command not found: ${commandName}`);
    }
}

export async function processCommands(input) {
    const commandsList = input.trim().split('&&').map(cmd => cmd.trim());
    for (const command of commandsList) {
        await processCommand(command);
    }
}
