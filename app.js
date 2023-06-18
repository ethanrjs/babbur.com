import express from "express";
import { join } from "path";
import { promises as fs } from "fs";
import serveStatic from "serve-static";
import dotenv from "dotenv";

import packagesRouter from "./routes/packages.js";
import searchRouter from "./routes/search.js";
import versionRouter from "./routes/version.js";
import supportRouter from "./routes/support.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5500;
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || 30000;

// Serve public files
app.use(serveStatic(join(import.meta.dir, "public")));

// Function to search and update package list
async function refreshPackageList() {
    try {
        const packagesPath = join(import.meta.dir, "packages");

        const folders = await fs.readdir(packagesPath);

        let updatedPackages = {};

        for (const folder of folders) {
            try {
                const packageJsonPath = join(packagesPath, folder, "package.json");
                const data = await fs.readFile(packageJsonPath);

                const packageJson = JSON.parse(data);
                updatedPackages[packageJson.name] = {
                    version: packageJson.version || "0.0.0",
                    path: join(folder) || "",
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
app.use("/search", searchRouter);
app.use("/version", versionRouter);
app.use("/this-is-why-i-should-be-support-for-binmaster", supportRouter);
app.use((req, res) => {
    res.status(404).send("Sorry, we couldn't find that!");
});


app.listen(PORT, () => {
    console.log(`Babbur.com is running on port ${PORT}`);
});