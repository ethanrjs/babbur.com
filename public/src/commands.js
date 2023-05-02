export let commands = {}

export function registerCommand(name, description, action) {
    commands[name] = {
        description,
        action
    }
}
