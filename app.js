const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const fastFuzzy = require("fast-fuzzy");
const serveStatic = require("serve-static");

const app = express();
const packagesRouter = require("./routes/packages");

require('dotenv').config();
const PORT = process.env.PORT || 5500;
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || 30000;

// Serve public files
app.use(serveStatic(path.join(__dirname, "public"), { etag: false, lastModified: false, setHeaders: (res) => { res.setHeader("Cache-Control", "no-store, no-cache"); } }));

// Function to search and update package list
async function refreshPackageList() {
    try {
        const packagesPath = path.join(__dirname, "packages");

        const folders = await fs.readdir(packagesPath);

        let updatedPackages = {};

        for (const folder of folders) {
            try {
                const packageJsonPath = path.join(packagesPath, folder, "package.json");
                const data = await fs.readFile(packageJsonPath);

                const packageJson = JSON.parse(data);
                updatedPackages[packageJson.name] = {
                    version: packageJson.version || "0.0.0",
                    path: path.join(folder) || "",
                    description: packageJson.description || "",
                    author: packageJson.author || "",
                };
            } catch (error) {
                console.error(`Error reading or parsing package.json in ${folder}:`, error);
            }
        }

        await fs.writeFile("packages.json", JSON.stringify(updatedPackages, null, 2));
    } catch (err) {
        console.error("Error reading packages directory or writing packages.json:", err);
    }
}

setInterval(refreshPackageList, REFRESH_INTERVAL);

app.use("/packages", packagesRouter);

app.use(require("./routes/search"));
app.use(require("./routes/create"));
app.use(require("./routes/version"));
app.use(require("./routes/editPackage"));

app.use((req, res) => {
    res.status(404).send("Sorry, we couldn't find that!");
});


app.listen(PORT, () => {
    console.log(`Babbur.com is running on port ${PORT}`);
});