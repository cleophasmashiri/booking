import {login, register, showMessage} from "./../controlles/auth";

import express from "express";

const router = express.Router();

router.get("/:message", showMessage);

router.post("/register", register);

router.post("/login", login);

module.exports = router;
