import { println, color } from './terminal.js';

println(`

███████╗████████╗██╗░░██╗██╗██╗░░██╗
██╔════╝╚══██╔══╝██║░░██║██║╚██╗██╔╝
█████╗░░░░░██║░░░███████║██║░╚███╔╝░
██╔══╝░░░░░██║░░░██╔══██║██║░██╔██╗░
███████╗░░░██║░░░██║░░██║██║██╔╝╚██╗
╚══════╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═╝░░╚═╝
`.green +
    `
Welcome to ETHIX. Type 'help' for a list of commands.
The ${"Ethix Package Manager".greenBright} is currently in development. 
You can install packages from the Ethix Package Manager by typing '${"epm install (name)".blueBright}'.

Find packages with '${"epm seek".blueBright}' or '${"epm search (query)".blueBright}'.
`)
