import { registerCommand } from "src/commands.js";

function onReady() {
    const allElements = document.querySelectorAll("*");
    console.log(allElements);
    // loop through all elements
    for (let i = 0; i < allElements.length; i++) {

        // get element
        const element = allElements[i];

        // set float to left
        element.style.float = "left";
        element.display = "inline-block";
    }
}

window["float_onReady"] = onReady;