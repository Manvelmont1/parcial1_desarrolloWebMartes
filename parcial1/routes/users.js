'use strict'

let express = require("express");
let userController = require("../controllers/users");

let router = express.Router();

// Funciones post:
router.post("/api/user", userController.createUser);
router.post("/api/login", userController.loginUser);

module.exports = router;
