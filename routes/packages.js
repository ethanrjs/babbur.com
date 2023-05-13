'use strict';

const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const packagesRouter = express.Router();

packagesRouter.get("/", async (req, res) => {
    const packageNames = req.query.packages.split(",");
    // Assumes filePaths is a string representation of a 2D array
    const filePaths = JSON.parse(req.query.files);
    const results = [];

    for (let i = 0; i < packageNames.length; i++) {
        const packageName = packageNames[i];
        const packageResults = [];

        for (let j = 0; j < filePaths[i].length; j++) {
            const filePath = filePaths[i][j];
            const fullPath = path.join(import.meta.dir, "../packages", packageName, filePath);

            try {
                const contents = await fs.readFile(fullPath, "utf8");
                packageResults.push({
                    filePath,
                    contents
                });
            } catch (err) {
                console.error(err);
                packageResults.push({
                    filePath,
                    error: "File not found"
                });
            }
        }

        results.push({
            packageName,
            files: packageResults
        });
    }

    res.status(200).json(results);
});

module.exports = packagesRouter;
