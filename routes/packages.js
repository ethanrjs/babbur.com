'use strict';

const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const packagesRouter = express.Router();

packagesRouter.get("/", async (req, res) => {
    const packageNames = req.query.packages.split(",");
    const filePaths = req.query.files.split(",");
    const results = [];

    for (let i = 0; i < packageNames.length; i++) {
        const packageName = packageNames[i];
        const filePath = filePaths[i];
        const fullPath = path.join(import.meta.dir, "../packages", packageName, filePath);

        try {
            const contents = await fs.readFile(fullPath, "utf8");
            results.push({
                packageName,
                filePath,
                contents
            });
        } catch (err) {
            console.error(err);
            results.push({
                packageName,
                filePath,
                error: "File not found"
            });
        }
    }

    res.status(200).json(results);
});

module.exports = packagesRouter;
