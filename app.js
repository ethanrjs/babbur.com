const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve public files
app.use(express.static(path.join(__dirname, "public")));

// Serve packages
app.use("/packages", express.static(path.join(__dirname, "packages")));

app.use((req, res) => {
    res.status(404).send("Sorry, we couldn't find that!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
1