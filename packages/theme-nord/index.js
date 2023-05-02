import { color, println } from "src/terminal.js";

color.red = "color: #BF616A";
color.green = "color: #A3BE8C";
color.yellow = "color: #EBCB8B";
color.blue = "color: #5E81AC";
color.magenta = "color: #B48EAD";
color.cyan = "color: #88C0D0";
color.white = "color: #E5E9F0";
color.black = "color: #2E3440";
color.gray = "color: #4C566A";

document.body.style.backgroundColor = "#2E3440";
document.body.style.color = "#E5E9F0";

println("Nord theme loaded".green);