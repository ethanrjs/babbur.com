import { registerCommand } from 'ethix:commands';
import { println } from 'ethix:stdio';

// in browser
const formattedNum = (a) => a.toString().replace('+', '0'.repeat(45) + 'x10^'); // add zeros and exponent symbol

const timeInMicroseconds = Date.now() - performance.timeOrigin;

registerCommand('uptime', 'figure out uptoime', () => {
    // multiply by 10^43 to get planck time
    const timeInPlanck = '' + formattedNum(timeInMicroseconds * 1e43);
    println(`${'uptime:'.green} ${timeInPlanck.gray + ' planck seconds'.gray}`);
});
