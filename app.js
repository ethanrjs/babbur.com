const express = require("express");
const path = require("path");
const fs = require("fs");
const fastFuzzy = require("fast-fuzzy");
const app = express();
const PORT = process.env.PORT || 5000;

// Serve public files
app.use(express.static(path.join(__dirname, "public")));


// Function to search and update package list
function refreshPackageList() {
    const packagesPath = path.join(__dirname, "packages");
    let packages = fs.existsSync("packages.json") ? JSON.parse(fs.readFileSync("packages.json")) : {};
    fs.readdir(packagesPath, (err, folders) => {
        if (err) {
            console.error("Error reading packages directory:", err);
            return;
        }

        folders.forEach(folder => {
            const packageJsonPath = path.join(packagesPath, folder, "package.json");
            fs.readFile(packageJsonPath, (err, data) => {
                if (err) {
                    console.error(`Error reading package.json in ${folder}:`, err);
                    return;
                }

                try {
                    // Parse package.json and add to packages list
                    const packageJson = JSON.parse(data);
                    packages[packageJson.name] = {
                        version: packageJson.version || "0.0.0",
                        path: path.join(folder) || "",
                        description: packageJson.description || "",
                        author: packageJson.author || "",
                    }

                    // Write packages list to file
                    fs.writeFile("packages.json", JSON.stringify(packages, null, 2), (err) => {
                        if (err) {
                            console.error("Error writing packages.json:", err);
                        }
                    });
                } catch (error) {
                    console.error(`Error parsing package.json in ${folder}:`, error);
                }
            });
        });
    });
}


setInterval(refreshPackageList, 30 * 1000);

const packagesRouter = express.Router();

packagesRouter.get("/:packageName/*", (req, res) => {
    const packageName = req.params.packageName;
    const filePath = req.params[0];
    const fullPath = path.join(__dirname, "packages", packageName, filePath);

    // Check if the file exists and serve it
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send("File not found");
            return;
        }

        res.sendFile(fullPath);
    });
});

app.use("/packages", packagesRouter);

// add /search endpoint which returns a list of packages matching the query (fuzzy search), their versions, and their descriptions
app.get("/search", (req, res) => {
    const query = req.query.q;
    const packages = JSON.parse(fs.readFileSync("packages.json"));
    const results = [];

    // fast fuzzy search
    const searchResults = fastFuzzy.search(query, Object.keys(packages));

    // add results to array
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

app.use((req, res) => {
    res.status(404).send("Sorry, we couldn't find that!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
