const colors = ['red', 'redBright', 'yellow', 'yellowBright', 'green', 'greenBright', 'blue', 'blueBright',
    'magenta', 'magentaBright', 'cyan', 'cyanBright', 'white', 'whiteBright', 'gray', 'black', 'blackBright'];

colors.forEach(color => {
    Object.defineProperty(String.prototype, color, {
        get() {
            const span = document.createElement('span');
            span.className = `terminal-color-${color}`;
            span.textContent = this;
            return span.outerHTML;
        }
    });
    Object.defineProperty(String.prototype, `bg${color.charAt(0).toUpperCase() + color.slice(1)}`, {
        get() {
            const span = document.createElement('span');
            span.className = `terminal-bgColor-${color}`;
            span.textContent = this;
            return span.outerHTML;
        }
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

export { colors as color }
