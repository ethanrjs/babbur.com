import { Router } from "express";

export default Router().get("/", (req, res) => {
    res.sendFile("support.html", { root: join(import.meta.dir, "public") });
});
