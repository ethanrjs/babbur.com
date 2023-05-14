import { Router } from "express";
import { search } from "fast-fuzzy";
const searchRouter = Router();

let packages = null;
let processedPackages = null;

async function loadPackages() {
    const file = Bun.file("packages.json");
    try {
        packages = JSON.parse(await file.text());
        processedPackages = Object.entries(packages).map(([name, data]) => ({
            name,
            version: data.version || "0.0.0",
            description: data.description || "No description set",
            author: data.author || "Anonymous"
        }));
    } catch (error) {
        console.error(`Failed to load packages: ${error}`);
    }
}

setInterval(loadPackages, 30000);

searchRouter.get("/", async (req, res) => {
    const query = req.query.q;

    if (!packages) {
        await loadPackages();
    }

    if (query === "@ALL") {
        res.send(processedPackages);
        return;
    }

    const searchResults = search(query, Object.keys(packages));

    const results = searchResults.map(result => processedPackages.find(pkg => pkg.name === result));

    res.send(results);
});

export default searchRouter;
