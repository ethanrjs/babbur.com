'use strict';

import { Router } from "express";
import { promises as fs } from "fs";
import { search } from "fast-fuzzy";
const searchRouter = Router();

searchRouter.get("/", async (req, res) => {
    const query = req.query.q;
    const packages = JSON.parse(await fs.readFile("packages.json"));
    const results = [];

    if (query === "@ALL") {
        for (const key in packages) {
            const packageName = packages[key];
            packageName.name = key;

            results.push(packageName);
        }
        res.send(results);
        return;
    }

    const searchResults = search(query, Object.keys(packages));

    searchResults.forEach(result => {
        results.push({
            name: result,
            version: packages[result].version || "0.0.0",
            description: packages[result].description || "No description set",
            author: packages[result].author || "Anonymous"
        });
    });

    res.send(results);
});

export default searchRouter;
