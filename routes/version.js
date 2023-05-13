'use strict';

import { Router } from "express";
const versionRouter = Router();

const PORT = process.env.PORT || 5500;

versionRouter.get("/", async (req, res) => {
    let version = require("../package.json").version;
    if (PORT == 5500) {
        version += "-dev";
    }
    res.send(version);
});

export default versionRouter;