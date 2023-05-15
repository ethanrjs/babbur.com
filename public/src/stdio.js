const colors = [
    'red',
    'redBright',
    'yellow',
    'yellowBright',
    'green',
    'greenBright',
    'blue',
    'blueBright',
    'magenta',
    'magentaBright',
    'cyan',
    'cyanBright',
    'white',
    'whiteBright',
    'gray',
    'black',
    'blackBright'
];
colors.forEach((color) => {
    Object.defineProperty(String.prototype, color, {
        get() {
            return `<span class="terminal-color-${color}">${this}</span>`;
        }
    });
    Object.defineProperty(String.prototype, `bg${color.charAt(0).toUpperCase() + color.slice(1)}`, {
        get() {
            return `<span class="terminal-bgColor-${color}">${this}</span>`;
        }
    });
});
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

export let prompt = true;

export function println(message) {
    const messageDiv = document.createElement('span');
    if (!message) return;
    messageDiv.innerHTML = message;
    // add br before
    output.appendChild(document.createElement('br'));
    output.appendChild(messageDiv);
    terminal.scrollTop = terminal.scrollHeight;
}
export function print(message) {
    const messageSpan = document.createElement('span');
    messageSpan.innerHTML = message;
    output.appendChild(messageSpan);
    terminal.scrollTop = terminal.scrollHeight;
}

export function clear() {
    output.innerHTML = '';
    terminal.scrollTop = terminal.scrollHeight;
}

export function disablePrompt() {
    prompt = false;
}

export function enablePrompt() {
    prompt = true;
    document.getElementById('input').focus();
    // scroll to bottom of #terminal
}

export { colors as color };
