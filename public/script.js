
async function loadCommands() {
    const startTime = performance.now();

    // Built-in commands
    const commands = [
        'epm',
        'rf',
        'help',
        'clear',
        'fs'
    ]

    const commandsToLoad = commands;
    const loadedCommands = {};

    for (const command of commandsToLoad) {
        await import(`./commands/${command}.js`);

        loadedCommands[command] = commands[command];
        // add to page's import map
        let imports = document.querySelector('head script[type="importmap"]')
        let json = JSON.parse(imports.innerHTML)
        json.imports[`commands/${command}.js`] = `./commands/${command}.js`
        imports.innerHTML = JSON.stringify(json)
    }

}

loadCommands();
