import { Router } from "express";
import { resolve, join } from "path";
import { promises as fs } from "fs";
const packagesRouter = Router();

packagesRouter.get("/", async (req, res) => {
    const packageNames = req.query.packages.split(",");
    let filePaths;
    try {
        filePaths = JSON.parse(req.query.files);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid files parameter' });
    }

    if (!Array.isArray(filePaths) || filePaths.length !== packageNames.length) {
        return res.status(400).json({ error: 'Invalid files parameter' });
    }

    const results = [];
    const packagesPath = resolve(import.meta.dir, "../packages");

    await Promise.all(packageNames.map(async (packageName, i) => {
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
