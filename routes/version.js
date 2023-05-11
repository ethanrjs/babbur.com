const express = require("express");
const versionRouter = express.Router();

const PORT = process.env.PORT || 5500;

versionRouter.get("/version", async (req, res) => {
    let version = require("../package.json").version;
    if (PORT == 5500) {
        version += "-dev";
    }
    res.send(version);
});

module.exports = versionRouter;