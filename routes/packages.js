import { Router } from "express";
import { resolve, join } from "path";
import { promises as fs } from "fs";
const packagesRouter = Router();

packagesRouter.get("/", async (req, res) => {

    if (!req.query.packages || !req.query.files) {
        return res.status(400).json({ error: 'Missing packages or files parameter' });
    }

    // @ts-ignore
    const packageNames = req.query.packages.split(",");
    /**
     * @type {string | string[]}
     */
    let filePaths;
    try {
        // @ts-ignore
        filePaths = JSON.parse(req.query.files);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid files parameter' });
    }

    if (!Array.isArray(filePaths) || filePaths.length !== packageNames.length) {
        return res.status(400).json({ error: 'Invalid files parameter' });
    }

    /**
     * @type {{ packageName: string; files: string[]; }[]}
     */
    const results = [];
    const packagesPath = resolve(import.meta.dir, "../packages");

    await Promise.all(packageNames.map(async (/** @type {string} */ packageName, /** @type {string | number} */ i) => {
        // @ts-ignore
        const packageResults = await Promise.all(filePaths[i].map(async (filePath) => {
            const fullPath = join(packagesPath, packageName, filePath);
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

export default packagesRouter;
