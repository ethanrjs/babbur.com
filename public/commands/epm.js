import { registerCommand } from 'ethix:commands'
import { println } from 'ethix:stdio'
import { createFile, createDirectory, currentDirectory } from 'ethix:fs';

export const packages = {};
registerCommand("epm", "Ethix Package Manager General Command", async (args) => {
    const arg1 = args[0]?.toLowerCase() || '';

    switch (arg1) {
        case 'install':
            await installPackageFromArgs(args);
            break;
        case 'remove':
            await removePackageFromArgs(args);
            break;
        case 'search':
            await searchPackageFromArgs(args);
            break;
        case 'list':
            await listInstalledPackages();
            break;
        case 'update':
            await updateAllPackages();
            break;
        case 'seek':
            await seekPackages();
            break;
        case 'create':
            await createPackageFromArgs(args[1]);
            break;
        default:
            displayHelp();
    }
});

async function installPackageFromArgs(args) {
    const packageName = args[1]?.toLowerCase();
    if (!packageName) {
        println("Please specify a package to install".red);
        return;
    }
    installPackage(packageName);
}

async function removePackageFromArgs(args) {
    const packageName = args[1]?.toLowerCase();
    if (!packageName) {
        println("Please specify a package to remove".red);
        return;
    }
    removePackage(packageName);
}

async function searchPackageFromArgs(args) {
    const splicedArgs = args.splice(1);
    if (splicedArgs.length === 0) {
        println("Please specify a query to search for".red);
        return;
    }
    searchPackage(splicedArgs.join(" "));
}

async function createPackageFromArgs(packageName) {
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
    await createDirectory(currentDirectory + '/' + packageName);
    await createFile(currentDirectory + '/' + packageName + "/package.json", packageJsonString);
    await createFile(currentDirectory + '/' + packageName + "/index.js", "");
    println(`Package ${packageName} created successfully`.green);
}

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

function getPackagesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("packages") || '{}');
}

// Imports and initializes a package
async function importPackage(packageNames, files) {
    const importProxy = new Proxy(
        {},
        {
            get: (target, prop) => {
                if (prop === "onReady") {
                    return function () {
                        for (const packageName of packageNames) {
                            if (typeof window[`${packageName}_onReady`] === "function") {
                                window[`${packageName}_onReady`]();
                            }
                        }
                    };
                }
                return target[prop];
            },
        }
    );

    const encodedNames = packageNames.join(",");
    const encodedFiles = encodeURIComponent(JSON.stringify(files));
    const moduleSpecifier = `/packages?packages=${encodedNames}&files=${encodedFiles}`;

    console.log(`Importing packages from ${moduleSpecifier}`)
    try {
        const response = await fetch(moduleSpecifier);
        if (!response.ok) {
            throw new Error(`Error fetching ${moduleSpecifier}`);
        }

        const packages = await response.json();
        for (const pkg of packages) {
            for (const file of pkg.files) {
                if (file.error) {
                    console.error(`Error importing file ${file.filePath} from package ${pkg.packageName}:`, file.error);
                    continue;
                }
                const blob = new Blob([file.contents], { type: "text/javascript" });
                const blobURL = URL.createObjectURL(blob);

                const importedModule = await import(blobURL);
                Object.assign(importProxy, importedModule);
                importProxy.onReady();

                URL.revokeObjectURL(blobURL);
            }
        }
    } catch (error) {
        console.error(`Error importing packages:`, error);
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

        const START_TIME_MS = Date.now();
        status(`Installing package ${packageName}...`.white);

        status(`\tFetching package data...`.gray);

        const response = await fetch(`/packages?packages=${packageName}&files=[["package.json"]]`);
        if (!response.ok) {
            status(`\tError installing package ${packageName}: Does not exist`.red);
            return;
        }

        let packageData;
        try {
            packageData = await response.json();
        } catch (err) {
            status(`\tError installing package ${packageName}: Invalid package data`.red);
            return;
        }

        if (!packageData || !packageData[0] || !packageData[0].files || !packageData[0].files[0]) {
            status(`\tError installing package ${packageName}: No package data returned`.red);
            return;
        }
        status(`\tDone`.green);

        const { version, files, dependencies = [] } = JSON.parse(packageData[0].files[0].contents);

        const packages = getPackagesFromLocalStorage();
        const storedPackage = packages[packageName] || null;
        if (storedPackage?.version === version) {
            status(`\tPackage ${packageName} is already installed and up to date`.green);
            return;
        } else {
            status(`\t${storedPackage ? "Updating" : "Downloading"} package ${packageName}...`.gray);
        }

        status("\tInstalling dependencies...".gray);
        await Promise.all(dependencies.map((dependency) => installPackage(dependency, true)));
        status("\tDone".green);

        status(`\tGetting ${files.length} file(s)...`.gray);
        await importPackage([packageName], [files]);
        status(`\tDone`.green);

        const packageInfo = { version, files, dependencies };

        packages[packageName] = packageInfo;

        localStorage.setItem("packages", JSON.stringify(packages));
        const TIME_TAKEN_MS = Date.now() - START_TIME_MS;
        status(`Package ${packageName} installed successfully`.green + ` (${TIME_TAKEN_MS}ms)`.gray);
    } catch (error) {
        println(`Error installing package. Check console for details`.red);
        console.error(error);
    }
}


async function removePackage(packageName) {
    const packages = getPackagesFromLocalStorage();
    if (packages[packageName]) {
        delete packages[packageName];
        localStorage.setItem("packages", JSON.stringify(packages));
        println(`Package ${packageName} removed successfully`.green);
        println(`Packages require you to reload the page to remove. This is a limitation of JavaScript.`.yellow)
    } else {
        println(`Package ${packageName} is not installed`.yellow);
    }
}

async function listInstalledPackages() {
    const packages = getPackagesFromLocalStorage();
    const packageNames = Object.keys(packages);
    if (packageNames.length === 0) {
        println("No packages installed".yellow);
        return;
    }

    println("Installed packages:".green);
    for (const packageName of packageNames) {
        const packageInfo = packages[packageName];

        if (!packageInfo) {
            delete packages[packageName];
            localStorage.setItem("packages", JSON.stringify(packages));
            continue;
        }
        println(`\t${packageName} (${packageInfo.version})`);
    }
}

async function loadInstalledPackages() {
    const START_TIME_MS = Date.now();
    const packages = getPackagesFromLocalStorage();
    let packageCount = 0;

    const packageNames = Object.keys(packages);
    const packagesToImport = [];

    for (const packageName of packageNames) {
        const storedPackage = packages[packageName];
        if (storedPackage && storedPackage.files) {
            const filePaths = storedPackage.files;
            packagesToImport.push({ packageName, filePaths });
            packageCount++;
        }
    }

    const names = packagesToImport.map(pkg => pkg.packageName);
    const files = packagesToImport.map(pkg => pkg.filePaths);  // Changed from flatMap to map

    if (packageCount === 0) {
        println("No packages installed".gray);
        return;
    }
    await importPackage(names, files);

    const TIME_TAKEN_MS = Date.now() - START_TIME_MS;
    println(`Loaded ${packageCount} package(s) in ${TIME_TAKEN_MS}ms`.gray);
}




async function searchPackage(query) {
    const START_TIME_MS = Date.now();
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

    searchResultsJson.forEach(result => {
        println(`\t${result.name.green} (${result.version.gray}) - ${result.author.blueBright}`);
        println(`\t\t${result.description}\n`);
    });

    const TIME_TAKEN_MS = Date.now() - START_TIME_MS;
    println(`Found ${searchResultsJson.length} package(s) in ${TIME_TAKEN_MS}ms`.gray);
}

async function seekPackages() {
    searchPackage("@ALL")
}


async function updateAllPackages() {
    const packageNames = Object.keys(getPackagesFromLocalStorage());
    for (const packageName of packageNames) {
        await installPackage(packageName);
    }
    println(`Updated ${packageNames.length} package(s)`.gray);
}
loadInstalledPackages();
