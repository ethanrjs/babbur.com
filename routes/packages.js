const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const packagesRouter = express.Router();

packagesRouter.get("/:packageName/*", async (req, res) => {
    const packageName = req.params.packageName;
    const filePath = req.params[0];
    const fullPath = path.join(__dirname, "../packages", packageName, filePath);

    try {
        await fs.access(fullPath, fs.constants.F_OK);
        const contents = await fs.readFile(fullPath, "utf8");
        res.status(200).send(contents);
    } catch (err) {
        res.status(404).send("File not found");
    }
});

module.exports = packagesRouter;