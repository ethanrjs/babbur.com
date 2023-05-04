import { commands } from "ethix:commands";
import { print, println } from "ethix:stdio";

async function processCommand(command) {
    const commandParts = command.split(' ');
    const commandName = commandParts.shift().trim();

    const targetCommand = Object.values(commands).find(cmd => cmd.name === commandName || cmd.aliases.includes(commandName));

    println(`$ `.gray);
    print(`${command} `.white);

    if (targetCommand) {
        const result = targetCommand.action(commandParts);

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
