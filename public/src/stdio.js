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
const promptElem = document.getElementById('prompt');
const output = document.getElementById('output');

export let prompt = true;

export function println(message) {
    const messageDiv = document.createElement('span');
    if (!message) return;
    messageDiv.innerHTML = message;
    // add br before
    output.appendChild(document.createElement('br'));
    output.appendChild(messageDiv);
    promptElem.scrollIntoView(false);
}
export function print(message) {
    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = message;
    output.appendChild(messageSpan);
    promptElem.scrollIntoView(false);
}

export function clear() {
    output.innerHTML = '';
    promptElem.scrollIntoView(false);
}

export function disablePrompt() {
    prompt = false;
}

export function enablePrompt() {
    prompt = true;
    document.getElementById('input').focus();
    promptElem.scrollIntoView(false);
}

export { colors as color }

