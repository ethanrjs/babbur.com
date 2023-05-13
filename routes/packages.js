'use strict';

const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const packagesRouter = express.Router();

packagesRouter.get("/", async (req, res) => {
    const packageNames = req.query.packages.split(",");
    const filePaths = JSON.parse(req.query.files);
    const results = [];
    const packagesPath = path.resolve(import.meta.dir, "../packages");

    await Promise.all(packageNames.map(async (packageName, i) => {
        const packageResults = await Promise.all(filePaths[i].map(async (filePath) => {
            const fullPath = path.join(packagesPath, packageName, filePath);
            try {
                const contents = await fs.readFile(fullPath, "utf8");
                return { filePath, contents };
            } catch (err) {
                console.error(err);
                return { filePath, error: "File not found" };
            }
        }));
        results.push({ packageName, files: packageResults });
    }));

    res.status(200).json(results);
});

module.exports = packagesRouter;
