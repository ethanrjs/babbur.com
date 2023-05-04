import { registerCommand } from "src/commands.js";

registerCommand("print", "Print your ETHIX terminal!", () => {
    window.print();
});