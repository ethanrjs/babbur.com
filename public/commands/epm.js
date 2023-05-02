import { registerCommand } from "../src/commands.js";
import { print, println } from "../src/terminal.js";

export const packages = {};

registerCommand("epm", "Ethix Package Manager General Command", (args) => {
    const arg1 = args[0]?.toLowerCase() || 'help';

    switch (arg1) {

        case 'install': {
            const arg2 = args[1].toLowerCase();
            if (!arg2) {
                println("Please specify a package to install".red);
                break;
            }
            installPackage(arg2);
            break;
        }
        case 'remove': {
            const arg2 = args[1].toLowerCase();
            if (!arg2) {
                println("Please specify a package to remove".red);
                break;
            }
            removePackage(arg2);
            break;
        }
        case 'search': {
            const arg2 = args[1].toLowerCase();
            if (!arg2) {
                println("Please specify a query to search for".red);
                break;
            }
            searchPackage(arg2);
            break;
        }
        case 'list': {
            listPackages();
            break;
        }
        default: {
            println("EPM Help".green);
            println("\tepm install <package> - Install a package");
            println("\tepm remove <package> - Remove a package");
            println("\tepm search <query> - Search for a package")
            println("\tepm list - List all installed packages");
            println("\tepm help - Show this help");
            break;
        }
    }
});

async function installPackage(packageName, isDependency = false) {
    try {
        if (!isDependency) {
            println(`Installing package ${packageName}...`.white);
            println(`\tFetching package.json...`.gray);
        } else {
            println(`\tInstalling dependency ${packageName}...`.white);
            println(`\t\tFetching package.json...`.gray);
        }

        const packageJson = await fetch(`/packages/${packageName}/package.json`);
        if (!packageJson.ok) {
            println(`\tError installing package ${packageName}: Does not exist`.red);
            return;
        }
        let packageJsonData;

        try {
            packageJsonData = await packageJson.json();
        } catch (err) {
            println(`\tError installing package ${packageName}: Invalid package.json`.red);
        }

        if (!packageJsonData) return;

        if (isDependency) {
            println(`\t\tDone`.green)
        } else {
            println(`\tDone`.green)
        }

        const version = packageJsonData.version;
        const files = packageJsonData.files;
        const dependencies = packageJsonData.dependencies || [];

        if (packageName in packages) {
            const storedPackage = JSON.parse(localStorage.getItem(packageName));
            if (storedPackage.version === version) {
                if (isDependency) {
                    println(`\t\tPackage ${packageName} is already installed and up to date`.green);
                } else {
                    println(`\tPackage ${packageName} is already installed and up to date`.green);
                }
                return;
            } else {
                if (isDependency) {
                    println(`\t\tUpdating package ${packageName}...`.gray);
                } else {
                    println(`\tUpdating package ${packageName}...`.gray);
                }
            }
        } else {

            if (isDependency) {
                println(`\t\tDownloading package ${packageName}...`.gray);
            } else {
                println(`\tDownloading package ${packageName}...`.gray);
            }
        }

        if (isDependency) {
            println("\t\tInstalling dependencies...".gray);
        } else {
            println("\tInstalling dependencies...".gray);
        }
        for (const dependency of dependencies) {
            await installPackage(dependency, true);
        }
        if (isDependency) {
            println("\t\tDone".green);
        } else {
            println("\tDone".green);
        }


        for (const file of files) {
            if (isDependency) {
                println(`\t\tGetting ${file}...`.gray);
            } else {
                println(`\tGetting ${file}...`.gray);
            }
            const packageFile = await fetch(`/packages/${packageName}/${file}`);
            const packageFileData = await packageFile.text();

            const blob = new Blob([packageFileData], { type: "text/javascript" });
            const url = URL.createObjectURL(blob);
            const script = document.createElement("script");
            script.src = url;
            script.type = "module";

            // add to import map
            const importMap = document.querySelector("script[type=importmap]");
            const importMapJson = JSON.parse(importMap.innerHTML);
            importMapJson.imports[`@${packageName}/${file}`] = url;
            importMap.innerHTML = JSON.stringify(importMapJson);

            document.head.appendChild(script);
            if (isDependency) {
                println(`\t\tDone`.green);
            } else {
                println(`\tDone`.green);
            }
        }

        const packageInfo = {
            version,
            files,
            dependencies,
        };

        localStorage.setItem(packageName, JSON.stringify(packageInfo));
        if (isDependency) {
            println(`\tDependency ${packageName} installed successfully`.green);

        } else {
            println(`Package ${packageName} installed successfully`.green);

        }

    } catch (error) {
        println(`Error installing package ${packageName}: ${error}`.red);
    }
}

async function removePackage(packageName) {
    if (localStorage.getItem(packageName)) {
        localStorage.removeItem(packageName);
        println(`Package ${packageName} removed successfully`.green);
    } else {
        println(`Package ${packageName} is not installed`.yellow);
    }
}

function listPackages() {
    const packageNames = Object.keys(localStorage);
    if (packageNames.length === 0) {
        println("No packages installed".yellow);
        return;
    }

    println("Installed packages:".green);
    for (const packageName of packageNames) {
        const packageInfo = JSON.parse(localStorage.getItem(packageName));
        println(`\t${packageName} (${packageInfo.version})`);
    }
}

async function loadInstalledPackages() {
    const packageNames = Object.keys(localStorage);
    for (const packageName of packageNames) {
        await installPackage(packageName);
    }
}


loadInstalledPackages();
