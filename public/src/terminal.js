


// Define color styles as CSS style strings
const colorStyles = {
    red: 'color: #C14141',
    redBright: 'color: #EA6565',
    yellow: 'color: #D2C42F',
    yellowBright: 'color: #F3E54C',
    green: 'color: #5FB83E',
    greenBright: 'color: #85E562',
    blue: 'color: #3E6FB8',
    blueBright: 'color: #65A0F8',
    magenta: 'color: #9A3FBB',
    magentaBright: 'color: #D269F8',
    cyan: 'color: #42C2C2',
    cyanBright: 'color: #80F8EE',
    white: 'color: #F0F0F0',
    whiteBright: 'color: #FFFFFF',
    gray: 'color: #A0A0A0',
    black: 'color: #111111',
    blackBright: 'color: #222222',
}




// Add color methods to the String prototype
Object.defineProperty(String.prototype, 'red', {
    get() { return `<span style="${colorStyles.red}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'redBright', {
    get() { return `<span style="${colorStyles.redBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'yellow', {
    get() { return `<span style="${colorStyles.yellow}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'yellowBright', {
    get() { return `<span style="${colorStyles.yellowBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'green', {
    get() { return `<span style="${colorStyles.green}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'greenBright', {
    get() { return `<span style="${colorStyles.greenBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'blue', {
    get() { return `<span style="${colorStyles.blue}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'blueBright', {
    get() { return `<span style="${colorStyles.blueBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'magenta', {
    get() { return `<span style="${colorStyles.magenta}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'magentaBright', {
    get() { return `<span style="${colorStyles.magentaBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'cyan', {
    get() { return `<span style="${colorStyles.cyan}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'cyanBright', {
    get() { return `<span style="${colorStyles.cyanBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'white', {
    get() { return `<span style="${colorStyles.white}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'whiteBright', {
    get() { return `<span style="${colorStyles.whiteBright}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'gray', {
    get() { return `<span style="${colorStyles.gray}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'black', {
    get() { return `<span style="${colorStyles.black}">${this}</span>` }
});
Object.defineProperty(String.prototype, 'blackBright', {
    get() { return `<span style="${colorStyles.blackBright}">${this}</span>` }
});
const prompt = document.getElementById('prompt');

export function println(message, textColor = 'white', backgroundColor = 'black') {

    // replace char code 9 in message with 4 spaces

    const output = document.getElementById('output');
    const messageDiv = document.createElement('span');
    if (!message) return;
    messageDiv.style.backgroundColor = colorStyles[backgroundColor];
    messageDiv.innerHTML = message[textColor] || message;

    // add br before
    output.appendChild(document.createElement('br'));

    output.appendChild(messageDiv);
    prompt.scrollIntoView(false);
}

export function print(message, textColor = 'white', backgroundColor = 'black') {
    // log char code of first char
    const output = document.getElementById('output');
    const messageSpan = document.createElement('span');

    messageSpan.style.backgroundColor = colorStyles[backgroundColor];
    messageSpan.innerHTML = message[textColor];

    output.appendChild(messageSpan);
    prompt.scrollIntoView(false);
}


export { colorStyles as color }