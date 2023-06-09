import { println } from "ethix:stdio"

export let commands = {};

/**
 * Registers a command.
 *
 * @param {string} name - The name of the command to register.
 * @param {string} description - A brief description of what the command does.
 * @param {function} action - The function to execute when the command is called.
 * @param {object} [options={}] - An optional object containing additional options for the command.
 * @param {string[]} [options.aliases=[]] - An optional array of aliases for the command.
 * @param {function} [options.onReady] - An optional function to execute when the command is first registered.
 * @param {string} [options.usage] - An optional usage string for the command, describing its expected arguments.
 * @throws {TypeError} If `name` or `action` is not provided or they are not of the correct type.
 * @returns {void}
 */
export function registerCommand(name, description, action, options = {}) {
    if (!name || typeof name !== 'string') {
        throw new TypeError('Command name must be a non-empty string');
    }

    if (!action || typeof action !== 'function') {
        throw new TypeError('Action must be a function');
    }

    const { aliases = [], onReady, usage } = options;

    const commandObj = {
        name,
        description,
        action,
        aliases,
        onReady,
        usage,
    };

    commands[name] = commandObj;

    if (onReady) {
        println(`Command loaded: ${name}`);
        onReady();
    }
}

/**
 * Retrieves command help text.
 *
 * @param {string} name - The name of the command to get help for.
 * @throws {TypeError} If `name` is not provided or it is not a string.
 * @returns {object} An object with boolean status field and a message field.
 */
export function getCommandHelp(name) {
    if (!name || typeof name !== 'string') {
        throw new TypeError('Command name must be a non-empty string');
    }

    if (!commands[name]) {
        return {
            success: false,
            message: `Command not found: ${name}`,
        };
    }

    const { description = 'none', aliases = ['none'], usage = 'none' } = commands[name];

    const helpText = `${"Description".green}: ${description}\n${"Aliases".green}: ${aliases.join(', ')}\n${"Usage".green}: ${usage.greenBright}`;

    return {
        success: true,
        message: helpText,
    };
}
