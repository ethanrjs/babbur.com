const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const createRouter = express.Router();
const rateLimit = require("express-rate-limit");


const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // limit to 2 requests per windowMs
    message: "Too many requests, please try again later.",
    headers: true // Send custom rate limit headers
});

createRouter.post("/create", createLimiter, async (req, res) => {
    const packageName = req.query.name;
    const packagePath = path.join(__dirname, "../packages", packageName);

    const packages = JSON.parse(await fs.readFile("packages.json"));

    if (packages[packageName]) {
        res.status(411).send("Package already exists");
        return;
    }

    try {
        await fs.access(packagePath, fs.constants.F_OK);
        res.status(411).send("Package directory already exists");
        return;
    } catch (err) {
        // Directory doesn't exist, continue
    }

    try {
        await fs.mkdir(packagePath);

        const packageJson = {
            name: packageName,
            version: "0.0.0",
            description: "",
            files: ["index.js"]
        }

        await fs.writeFile(path.join(packagePath, "package.json"), JSON.stringify(packageJson, null, 2));
        await fs.writeFile(path.join(packagePath, "index.js"), "");

        res.status(200).send("Package created successfully");
    } catch (err) {
        res.status(500).send("Error creating package");
    }

});

module.exports = createRouter;