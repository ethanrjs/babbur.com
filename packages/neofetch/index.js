import { registerCommand } from 'ethix:commands';
let loadStartTime = Date.now();

registerCommand('neofetch', 'Prints a cool ASCII art logo', () => {
    const logoLines = `.
          _____          
         /\\    \\         
        /::\\    \\        
       /::::\\    \\       
      /::::::\\    \\      
     /:::/\\:::\\    \\     
    /:::/__\\:::\\    \\    
   /::::\\   \\:::\\    \\   
  /::::::\\   \\:::\\    \\  
 /:::/\\:::\\   \\:::\\    \\ 
/:::/__\\:::\\   \\:::\\____\\
\\:::\\   \\:::\\   \\::/    /
 \\:::\\   \\:::\\   \\/____/ 
  \\:::\\   \\:::\\    \\     
   \\:::\\   \\:::\\____\\    
    \\:::\\   \\::/    /    
     \\:::\\   \\/____/     
      \\:::\\    \\         
       \\:::\\____\\        
        \\::/    /        
         \\/____/         
                         


`
        .trim()
        .split('\n')
        .map((line) => line.greenBright);

    const sideLines = `
root@ethix
----------
${'OS'.greenBright}: ${'Ethix'.white}
${'Kernel'.greenBright}: ${'Ethix'.white}
${'Uptime'.greenBright}: ${Date.now() - loadStartTime}ms
${'Agent'.greenBright}: ${navigator.userAgent.white}
${'Shell'.greenBright}: ${'Ethix'.white}
${'DE'.greenBright}: ${'Ethix'.white}
${'WM'.greenBright}: ${'Ethix'.white}
${'WM Theme'.greenBright}: ${'Ethix'.white}
${'Icons'.greenBright}: ${'Ethix'.white}
${'Terminal'.greenBright}: ${'Ethix'.white}
${'Resolution'.greenBright}: ${window.innerWidth + 'x' + window.innerHeight}
`
        .trim()
        .split('\n')
        .map((line) => line.white);

    const maxLength = Math.max(...logoLines.map((line) => line.length)) + 8;

    const paddedLogoLines = logoLines.map((line) => line.padEnd(maxLength, ' '));

    let result = '';
    for (let i = 0; i < paddedLogoLines.length; i++) {
        result += paddedLogoLines[i] + (sideLines[i] || '') + '\n';
    }
    const colors = [
        '',
        'bgRed',
        'bgRedBright',
        'bgYellow',
        'bgYellowBright',
        'bgGreen',
        'bgGreenBright',
        'bgBlue',
        'bgBlueBright',
        'bgMagenta',
        'bgMagentaBright',
        'bgCyan',
        'bgCyanBright',
        'bgWhite',
        'bgWhiteBright',
        'bgGray',
        'bgBlack',
        'bgBlackBright'
    ];
    // literally no fucking clue why entering a space at2 653ytyhetyy65365y365y65eyt

    // rewrite to work with array
    const colorLine = colors.reduce((acc, colorName) => {
        return acc + '   '[colorName];
        // This here, is the ugliest fucking line of code I have written in all
        //     // of my years of web development. Why, in gods name, does putting an
        //     // array up to a string reference the string's property of the
        //     // color name, rather than throwing an error?? Why doesn't it just try
        //     // to get the char? Not only that, but getting the keynames of
        //     // an object, and then reducing, there's like fifteen higher-order
        //     /// functions in here. Why is this code written like this???
        //     // I'll never know. I will never understand this language,
        //     // this god-forsaken terrible programming language that I willingly
        //     // choose to suffer through writing.
    });

    const colorPadding = ' '.repeat(maxLength - 43);
    result += colorPadding + colorLine;

    return result;
});
