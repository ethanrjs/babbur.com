export let commands = {};

export function registerCommand(name, description, action, options = {}) {
    const { aliases = [], onReady, onTabComplete } = options;

    const commandObj = {
        name,
        description,
        action,
        aliases,
        onReady,
        onTabComplete
    };

    commands[name] = commandObj;

    // Register aliases
    aliases.forEach(alias => {
        commands[alias] = commandObj;
    });
}

export function getCommandHelp(name) {
    if (commands[name]) {
        const { description, aliases } = commands[name];
        const helpText = `Description: ${description}\nAliases: ${aliases.join(', ')}`
        return helpText;
    }
    return `Command not found: ${name}`;
}

