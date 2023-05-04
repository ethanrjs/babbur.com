const colors = ['red', 'redBright', 'yellow', 'yellowBright', 'green', 'greenBright', 'blue', 'blueBright',
    'magenta', 'magentaBright', 'cyan', 'cyanBright', 'white', 'whiteBright', 'gray', 'black', 'blackBright'];

colors.forEach(color => {
    Object.defineProperty(String.prototype, color, {
        get() { return `<span class="terminal-color-${color}">${this}</span>`; }
    });
    Object.defineProperty(String.prototype, `bg${color.charAt(0).toUpperCase() + color.slice(1)}`, {
        get() { return `<span class="terminal-bgColor-${color}">${this}</span>`; }
    });
});


const prompt = document.getElementById('prompt');

export function println(message) {
    const output = document.getElementById('output');
    const messageDiv = document.createElement('span');
    if (!message) return;

    messageDiv.innerHTML = message;

    // add br before
    output.appendChild(document.createElement('br'));

    output.appendChild(messageDiv);
    prompt.scrollIntoView(false);
}

export function print(message) {
    const output = document.getElementById('output');
    const messageSpan = document.createElement('span');

    messageSpan.innerHTML = message;

    output.appendChild(messageSpan);
    prompt.scrollIntoView(false);
}

// if #input is ever unfocused, refocus



export { colors as color }