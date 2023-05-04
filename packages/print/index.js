import { registerCommand } from "ethix:commands"
import { println } from "ethix:stdio"
registerCommand("print", "Print your ETHIX terminal!", () => {
    window.print();
}, {
    onReady: () => {
        println("Print command loaded!".green);
    }
});
