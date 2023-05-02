// rf command refreshes page

import { registerCommand } from "src/commands.js";

registerCommand("rf", "Refreshes the page", () => {
    location.reload();
});