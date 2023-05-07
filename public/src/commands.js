import { println } from "ethix:stdio"
export let commands = {};


/**
 *
 *
 * @param {string} name - The name of the command to register.
 * @param {string} description - A brief description of what the command does.
 *  @param {function} action - The function to execute when the command is called.
 *  @param {object} [options={}] - An optional object containing additional options for the command.
 *  @param {string[]} [options.aliases=[]] - An optional array of aliases for the command.
 *  @param {function} [options.onReady] - An optional function to execute when the command is first registered.
 *  @param {function} [options.onTabComplete] - DO NOT USE. THIS IS BROKEN AND IT WILL BREAK EVERYTHING EVEN I DONT KNOW HOW TO USE IT AND I WROTE IT.
 *  @param {string} [options.usage] - An optional usage string for the command, describing its expected arguments.
 *  @returns {void}
 */
export function registerCommand(name, description, action, options = {}) {
    const { aliases = [], onReady, onTabComplete, usage } = options;

    const commandObj = {
        name,
        description,
        action,
        aliases,
        onReady,
        onTabComplete,
        usage,
        longDescription: null,
    };

    commands[name] = commandObj;

    if (onReady) {
        println(`Command loaded: ${name}`.green);
        onReady();
    }
}

export function getCommandHelp(name) {
    if (commands[name]) {
        let { description, aliases, longDescription } = commands[name];

        if (!description) {
            description = `none`;
        }

        if (aliases.length === 0) {
            aliases = ['none'.gray]
        }


        const helpText = `${"Description".green}: ${longDescription || description}\n${"Aliases".green}: ${aliases.join(', ')}\n${"Usage".green}: ${commands[name]?.usage?.greenBright || 'none'.gray}`;
        return helpText;
    }
    return `Command not found: ${name}`;
}

