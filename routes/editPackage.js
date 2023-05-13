// edit package.js

// first, find the path from packages.json then get the package, the key is in the body
// then, go into that folder and overwrite the file but only if the "secret" in packages.json matches the secret in the body
// example body:
// {
// package: "test",
// secret: "testSecret12ijgnersikgseg",
// file: "index.js",
// content: "console.log('test')"
// }
'use strict';

const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const createRouter = express.Router();

createRouter.post("/edit", async (req, res) => {
    const { package: packageName, secret, file, content } = req.body;

    try {
        const packages = JSON.parse(await fs.readFile("packages.json"));
        const packageData = packages[packageName];

        if (!packageData) {
            res.status(404).send("Package not found");
            return;
        }

        if (packageData.secret !== secret) {
            res.status(403).send("Invalid secret");
            return;
        }

        const packagePath = path.join(__dirname, "../packages", packageName);
        const filePath = path.join(packagePath, file);

        // Check if the file exists
        try {
            await fs.access(filePath, fs.constants.F_OK);
        } catch (err) {
            res.status(404).send("File not found");
            return;
        }

        // Overwrite the file
        await fs.writeFile(filePath, content);
        res.status(200).send("File edited successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error editing package");
    }
});

module.exports = createRouter;