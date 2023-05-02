const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve public files
app.use(express.static(path.join(__dirname, "public")));

// set cache control
app.use((req, res, next) => {
    res.set("Cache-Control", "public, max-age=31557600");
    next();
});

// Serve packages
app.use("/packages", express.static(path.join(__dirname, "packages")));

app.use((req, res) => {
    res.status(404).send("Sorry, we couldn't find that!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
1