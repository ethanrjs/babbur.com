import { registerCommand } from 'ethix:commands';
import { println } from 'ethix:stdio';
import { updatePrompt } from "ethix:inputHandler";

let fileSystem = {};
export let currentDirectory = '/';

// on page load, set the current directory to the cwd
window.addEventListener('load', () => {
    currentDirectory = localStorage.getItem('cwd') || '/';
    updatePrompt()
});

function getDirectory(path) {
    const pathParts = path.split('/');
    let current = fileSystem;

    for (const part of pathParts) {
        if (part === '') continue;
        if (current.hasOwnProperty(part) && typeof current[part] === 'object') {
            current = current[part];
        } else {
            return null;
        }
    }

    return current;
}

function deleteEntry(fullPath) {
    const pathParts = fullPath.split('/');
    const entryName = pathParts.pop();
    const directoryPath = pathParts.join('/');

    const directory = getDirectory(directoryPath);

    if (directory && directory.hasOwnProperty(entryName)) {
        delete directory[entryName];
    } else {
        println(`Entry not found: ${fullPath}`);
    }
}



function readFile(fullPath) {
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop();
    const directoryPath = pathParts.join('/');

    const directory = getDirectory(directoryPath);

    if (directory && typeof directory[fileName] === 'string') {
        return directory[fileName];
    } else {
        println(`File not found: ${fullPath}`);
        return '';
    }
}

function createFile(fullPath, content) {
    const pathParts = fullPath.split('/');
    const fileName = pathParts.pop();
    const directoryPath = pathParts.join('/');

    const directory = getDirectory(directoryPath);

    if (directory) {
        directory[fileName] = content;
    } else {
        println(`Directory not found: ${directoryPath}`);
    }
}

function createDirectory(fullPath) {
    const pathParts = fullPath.split('/');
    const directoryName = pathParts.pop();
    const directoryPath = pathParts.join('/');

    const directory = getDirectory(directoryPath);

    if (directory) {
        directory[directoryName] = {};
    } else {
        println(`Directory not found: ${directoryPath}`);
    }
}

function updateFile(fullPath, content) {
    createFile(fullPath, content);
}
function changeDirectory(path) {
    const directory = getDirectory(path);

    if (directory) {
        currentDirectory = path;
        localStorage.setItem('cwd', currentDirectory);
    } else {
        println(`Directory not found: ${path}`);
    }
}

function saveFileSystem() {
    localStorage.setItem('virtualFileSystem', JSON.stringify(fileSystem));
}

function loadFileSystem() {
    const loadedData = localStorage.getItem('virtualFileSystem');

    if (loadedData) {
        fileSystem = JSON.parse(loadedData);
    }
}

window.onload = loadFileSystem;
setInterval(saveFileSystem, 2000);

loadFileSystem();

// Commands

class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileSystemError';
    }
}

function resolvePath(path) {
    if (path.startsWith('/')) {
        return path;
    }
    const newPath = currentDirectory === '/' ? `/${path}` : `${currentDirectory}/${path}`;
    return newPath;
}

function cat(args) {
    if (args.length === 0) {
        throw new FileSystemError('Usage: fs cat <file>');
    }

    const filePath = resolvePath(args[0]);
    const content = readFile(filePath);
    println(content);
}


function cd(args) {
    if (args.length === 0) {
        currentDirectory = '/';
        localStorage.setItem('cwd', currentDirectory);
        return;
    }
    console.log(args)

    const newPath = resolvePath(args[0]);
    changeDirectory(newPath);
}

function mkdir(args) {
    if (args.length === 0) {
        throw new FileSystemError('Usage: fs mkdir <directory>');
    }
    const dirPath = resolvePath(args[0]);
    createDirectory(dirPath);
}

function rm(args) {
    if (args.length === 0) {
        throw new FileSystemError('Usage: fs rm <file/directory>');
    }
    const entryPath = resolvePath(args[0]);
    deleteEntry(entryPath);
}

registerCommand('cat', 'Output the content of a file', (args) => {
    try {
        cat(args);
    } catch (error) {
        println(error);
        console.error(error);
    }
});

registerCommand('cd', 'Change the current working directory', (args) => {
    try {
        cd(args);
    } catch (error) {
        println(error);
        console.error(error);
    }
});

registerCommand('mkdir', 'Create a new directory', (args) => {
    try {
        mkdir(args);
    } catch (error) {
        println(error);
        console.error(error);
    }
});

registerCommand('rm', 'Remove a file or directory', (args) => {
    try {
        rm(args);
    } catch (error) {
        println(error);
        console.error(error);
    }
});

registerCommand('pwd', 'Display the current working directory', (args) => {
    if (currentDirectory === '/') {
        println(currentDirectory);
        return;
    }

    println(currentDirectory + '/');
});

// ls command gets more stuff cause its complex
// Utility functions

function fileType(entry) {
    return typeof entry === 'object' ? 'directory' : 'file';
}

function formatEntry(entry, type, options) {
    if (options.color) {
        return type === 'directory' ? entry.blue : entry.green;
    }
    return entry;
}

// Command implementation

function ls(args) {
    const options = parseLsOptions(args);
    const path = args.length === 0 ? currentDirectory : resolvePath(args[0]);
    const list = listDirectory(path, options);

    println(list.join('\n'));
}

function parseLsOptions(args) {
    const options = {
        color: true,
        longFormat: false,
        sortBySize: false,
        sortByDate: false,
        recursive: false,
        wildcard: null
    };

    const filteredArgs = [];

    for (const arg of args) {
        if (arg.startsWith('-')) {
            for (const flag of arg.slice(1)) {
                switch (flag) {
                    case 'l':
                        options.longFormat = true;
                        break;
                    case 'S':
                        options.sortBySize = true;
                        break;
                    case 't':
                        options.sortByDate = true;
                        break;
                    case 'R':
                        options.recursive = true;
                        break;
                    default:
                        throw new FileSystemError(`Unknown option: -${flag}`);
                }
            }
        } else {
            filteredArgs.push(arg);
        }
    }

    args.length = 0;
    args.push(...filteredArgs);

    return options;
}

function listDirectory(path, options) {
    const directory = getDirectory(path);

    if (directory) {
        const entries = Object.entries(directory).map(([name, entry]) => {
            const type = fileType(entry);
            return { name, type };
        });

        if (options.sortBySize) {
            entries.sort((a, b) => b.size - a.size);
        } else if (options.sortByDate) {
            entries.sort((a, b) => b.date - a.date);
        } else {
            entries.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (options.recursive) {
            const subdirectories = entries.filter((entry) => entry.type === 'directory');
            for (const subdir of subdirectories) {
                entries.push(...listDirectory(`${path}/${subdir.name}`, options));
            }
        }

        return entries.map((entry) => formatEntry(entry.name, entry.type, options));
    } else {
        println(`Directory not found: ${path}`);
        return [];
    }
}

// Register the improved ls command
registerCommand('ls', `List directory contents.`, (args) => {
    try {
        ls(args);
    } catch (error) {
        println(error);
        console.error(error);
    }
}, {
    longDescription: `
    Usage: ls [options] [path]
    Use -l to display long format.
    Use -S to sort by size.
    Use -t to sort by date.
    Use -R to list subdirectories recursively.
    Use -c to disable color.`
});;

export {
    fileSystem,
    createFile,
    updateFile,
    readFile,
    createDirectory,
    getDirectory,
    changeDirectory,
    deleteEntry,
    listDirectory,
    resolvePath,

};