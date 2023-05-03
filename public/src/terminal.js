const colorStyles = {
    red: 'color: #C14141', redBright: 'color: #EA6565',
    yellow: 'color: #D2C42F', yellowBright: 'color: #F3E54C',
    green: 'color: #5FB83E', greenBright: 'color: #85E562',
    blue: 'color: #3E6FB8', blueBright: 'color: #65A0F8',
    magenta: 'color: #9A3FBB', magentaBright: 'color: #D269F8',
    cyan: 'color: #42C2C2', cyanBright: 'color: #80F8EE',
    white: 'color: #F0F0F0', whiteBright: 'color: #FFFFFF',
    gray: 'color: #A0A0A0',
    black: 'color: #111111', blackBright: 'color: #222222',
    bgRed: 'background-color: #C14141', bgRedBright: 'background-color: #EA6565',
    bgYellow: 'background-color: #D2C42F', bgYellowBright: 'background-color: #F3E54C',
    bgGreen: 'background-color: #5FB83E', bgGreenBright: 'background-color: #85E562',
    bgBlue: 'background-color: #3E6FB8', bgBlueBright: 'background-color: #65A0F8',
    bgMagenta: 'background-color: #9A3FBB', bgMagentaBright: 'background-color: #D269F8',
    bgCyan: 'background-color: #42C2C2', bgCyanBright: 'background-color: #80F8EE',
    bgWhite: 'background-color: #F0F0F0', bgWhiteBright: 'background-color: #FFFFFF',
    bgGray: 'background-color: #A0A0A0',
    bgBlack: 'background-color: #111111', bgBlackBright: 'background-color: #222222',
};

const colors = ['red', 'redBright', 'yellow', 'yellowBright', 'green', 'greenBright', 'blue', 'blueBright',
    'magenta', 'magentaBright', 'cyan', 'cyanBright', 'white', 'whiteBright', 'gray', 'black', 'blackBright'];

colors.forEach(color => {
    Object.defineProperty(String.prototype, color, {
        get() { return `<span style="${colorStyles[color]}">${this}</span>`; }
    });
    Object.defineProperty(String.prototype, `bg${color.charAt(0).toUpperCase() + color.slice(1)}`, {
        get() { return `<span style="${colorStyles['bg' + color.charAt(0).toUpperCase() + color.slice(1)]}">${this}</span>`; }
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


export { colorStyles as color }