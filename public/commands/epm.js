import { registerCommand } from 'ethix:commands'
import { println } from 'ethix:stdio'
import { createFile, createDirectory, readFile, resolvePath, currentDirectory } from 'ethix:fs';

export const packages = {};

registerCommand("epm", "Ethix Package Manager General Command", async (args) => {
    const arg1 = args[0]?.toLowerCase() || 'help';

    switch (arg1) {
        case 'install':
            await handleInstall(args);
            break;
        case 'remove':
            await handleRemove(args);
            break;
        case 'search':
            await handleSearch(args);
            break;
        case 'list':
            await listPackages();
            break;
        case 'update':
            await updateAllPackages();
            break;
        case 'seek':
            await seekPackages();
            break;
        case 'create':
            await createPackage(args[1]);
            break;
        default:
            displayHelp();
    }
});

// Handles the install command
async function handleInstall(args) {
    const arg2 = args[1].toLowerCase();
    if (!arg2) {
        println("Please specify a package to install".red);
        return;
    }
    installPackage(arg2);
}

// Handles the remove command
async function handleRemove(args) {
    const arg2 = args[1].toLowerCase();
    if (!arg2) {
        println("Please specify a package to remove".red);
        return;
    }
    removePackage(arg2);
}

// Handles the search command
async function handleSearch(args) {
    const splicedArgs = args.splice(1);
    if (splicedArgs.length === 0) {
        println("Please specify a query to search for".red);
        return;
    }
    searchPackage(splicedArgs.join(" "));
}

// Displays the help information
async function displayHelp() {
    println("EPM Help".green);
    println("\tepm install (package) - Install a package");
    println("\tepm remove (package) - Remove a package");
    println("\tepm search (query) - Search for a package")
    println("\tepm list - List all installed packages");
    println("\tepm update - Update all installed packages");
    println("\tepm seek - Seek all packages in repository");
    println("\tepm help - Show this help");
    println("\tepm create (name) - Create a new package");
}

// Imports and initializes a package
// Imports and initializes a package
// Imports and initializes a package
async function importPackage(packageName, fileName) {
    const importProxy = new Proxy(
        {},
        {
            get: (target, prop) => {
                if (prop === "onReady") {
                    return function () {
                        if (typeof window[`${packageName}_onReady`] === "function") {
                            window[`${packageName}_onReady`]();
                        }
                    };
                }
                return target[prop];
            },
        }
    );

    const moduleSpecifier = `/packages/${packageName}/${fileName}`;
    try {
        const response = await fetch(moduleSpecifier);
        if (!response.ok) {
            throw new Error(`Error fetching ${moduleSpecifier}`);
        }

        const moduleText = await response.text();
        const blob = new Blob([moduleText], { type: "text/javascript" });
        const blobURL = URL.createObjectURL(blob);

        const module = await import(blobURL);
        Object.assign(importProxy, module);
        importProxy.onReady();

        URL.revokeObjectURL(blobURL);
    } catch (error) {
        console.error(`Error importing package ${packageName}:`, error);
    }
}




// Helper function to display status messages
async function printStatus(message, isDependency = false, isStartup = false) {
    if (!isStartup) {
        const prefix = isDependency ? "\t" : "";
        println(`${prefix}${message}`);
    }
}

async function installPackage(packageName, isDependency = false, isStartup = false) {
    try {
        const status = (message) => printStatus(message, isDependency, isStartup);

        status(`Installing package ${packageName}...`.white);
        status(`\tFetching package.json...`.gray);

        const packageJson = await fetch(`/packages/${packageName}/package.json`);
        if (!packageJson.ok) {
            status(`\tError installing package ${packageName}: Does not exist`.red);
            return;
        }

        let packageJsonData;
        try {
            packageJsonData = await packageJson.json();
        } catch (err) {
            status(`\tError installing package ${packageName}: Invalid package.json`.red);
        }

        if (!packageJsonData) return;
        status(`\tDone`.green);

        const { version, files, dependencies = [] } = packageJsonData;

        const storedPackage = JSON.parse(localStorage.getItem(packageName));
        if (storedPackage?.version === version) {
            status(`\tPackage ${packageName} is already installed and up to date`.green);
            return;
        } else {
            status(`\t${storedPackage ? "Updating" : "Downloading"} package ${packageName}...`.gray);
        }

        status("\tInstalling dependencies...".gray);
        await Promise.all(dependencies.map((dependency) => installPackage(dependency, true)));
        status("\tDone".green);

        for (const file of files) {
            status(`\tGetting ${file}...`.gray);
            await importPackage(packageName, file);
            status(`\tDone`.green);
        }

        const packageInfo = { version, files, dependencies };
        localStorage.setItem(packageName, JSON.stringify(packageInfo));
        status(`Package ${packageName} installed successfully`.green);
    } catch (error) {
        println(`Error installing package ${packageName}: ${error}`.red);
    }
}

async function removePackage(packageName) {
    if (localStorage.getItem(packageName)) {
        localStorage.removeItem(packageName);
        println(`Package ${packageName} removed successfully`.green);
        println(`Some packages require you to refresh the page to be fully removed`.yellow)
    } else {
        println(`Package ${packageName} is not installed`.yellow);
    }
}

async function listPackages() {
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
    let packageCount = 0;
    for (const packageName of packageNames) {
        const storedPackage = JSON.parse(localStorage.getItem(packageName));
        if (storedPackage) {
            const { files } = storedPackage;
            if (!files) continue;
            for (const file of files) {
                await importPackage(packageName, file);
            }
            packageCount++;
        }
    }
    println(`Loaded ${packageCount} package(s)`.gray);
}


async function searchPackage(query) {
    // search package from /search endpoint
    const searchResults = await fetch(`/search?q=${query}`);
    const searchResultsJson = await searchResults.json();


    if (searchResultsJson.length === 0) {
        println(`No packages could be found. Run "epm seek" to view all packages.`.redBright);
        return;
    }

    if (query === "@ALL") {
        println(`Search results for all packages:`.green);
    } else {
        println(`Search results for query ${query}:`.green);
    }
    for (const result of searchResultsJson) {
        println(`\t${result.name.green} (${result.version.gray}) - ${result.author.blueBright}`);
        println(`\t\t${result.description}\n`);

    }
}

async function seekPackages() {
    // get all packages
    searchPackage("@ALL")
}

async function updateAllPackages() {
    const packageNames = Object.keys(localStorage);
    for (const packageName of packageNames) {
        await installPackage(packageName);
    }
    println(`Updated ${packageNames.length} package(s)`.gray);
}

async function createPackage(packageName) {
    if (!packageName) {
        println("Please specify a package name".red);
        return;
    }

    const packageJson = {
        name: packageName,
        version: "1.0.0",
        description: "My custom package",
        files: ["index.js"],
        dependencies: [],
    }

    const packageJsonString = JSON.stringify(packageJson, null, 4);
    await createDirectory(currentDirectory + packageName);
    await createFile(currentDirectory + packageName + "/package.json", packageJsonString);
    await createFile(currentDirectory + packageName + "/index.js", "");
    println(`Package ${packageName} created successfully`.green);
}

loadInstalledPackages();
