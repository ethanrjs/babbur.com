import { registerCommand } from "ethix:commands"
let loadStartTime = Date.now()

registerCommand("neofetch", "Prints a cool ASCII art logo", () => {
    const logoLines =
        `.
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
                         


`.trim().split('\n').map(line => line.greenBright);

    const sideLines = `
root@ethix
----------
${"OS".greenBright}: ${"Ethix".white}
${"Kernel".greenBright}: ${"Ethix".white}
${"Uptime".greenBright}: ${Date.now() - loadStartTime}ms
${"Agent".greenBright}: ${navigator.userAgent.white}
${"Shell".greenBright}: ${"Ethix".white}
${"DE".greenBright}: ${"Ethix".white}
${"WM".greenBright}: ${"Ethix".white}
${"WM Theme".greenBright}: ${"Ethix".white}
${"Icons".greenBright}: ${"Ethix".white}
${"Terminal".greenBright}: ${"Ethix".white}
${"Resolution".greenBright}: ${window.innerWidth + "x" + window.innerHeight}
`.trim().split('\n').map(line => line.white);

    const maxLength = Math.max(...logoLines.map(line => line.length)) + 8;

    const paddedLogoLines = logoLines.map(line => line.padEnd(maxLength, ' '));

    let result = '';
    for (let i = 0; i < paddedLogoLines.length; i++) {
        result += paddedLogoLines[i] + (sideLines[i] || '') + '\n';
    }
    const darkColors = [
        "",
        "bgRed",
        "bgYellow",
        "bgGreen",
        "bgBlue",
        "bgMagenta",
        "bgCyan",
        "bgWhite",
        "bgGray",
        "bgBlack",
    ];

    const lightColors = [
        "",
        "bgRedBright",
        "bgYellowBright",
        "bgGreenBright",
        "bgBlueBright",
        "bgMagentaBright",
        "bgCyanBright",
        "bgWhiteBright",
        "bgBlackBright",
    ];

    const darkColorLine = darkColors.reduce((acc, colorName) => {
        return acc + "   "[colorName];
    });

    const lightColorLine = lightColors.reduce((acc, colorName) => {
        return acc + "   "[colorName];
    });

    const colorPadding = ' '.repeat(maxLength - 48);
    result += colorPadding + darkColorLine + '\n' + colorPadding + lightColorLine;

    return result;
});
