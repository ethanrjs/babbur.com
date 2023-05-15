import { println } from 'ethix:stdio';

const version = await fetch('/version').then((res) => res.text());

println(
    `

███████╗████████╗██╗░░██╗██╗██╗░░██╗
██╔════╝╚══██╔══╝██║░░██║██║╚██╗██╔╝
█████╗░░░░░██║░░░███████║██║░╚███╔╝░
██╔══╝░░░░░██║░░░██╔══██║██║░██╔██╗░
███████╗░░░██║░░░██║░░██║██║██╔╝╚██╗
╚══════╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═╝░░╚═╝
`.green +
        `
Welcome to ETHIX. Type '${'help'.blueBright}' for a list of commands.
The ${'Ethix Package Manager'.greenBright} is currently in development. 
You can install packages from the Ethix Package Manager by typing '${'epm install (name)'.blueBright}'.

Find packages with '${'epm seek'.blueBright}' or '${'epm search (query)'.blueBright}'.

${'You are on version '.gray + version.gray}
`
);
