'use strict';

let express = require("express");
let bodyParser = require("body-parser");

// Rutas users y movies:
let routerUsers = require("./routes/users");
let routerMovies = require("./routes/movies");

let application = express();

application.use(bodyParser.json());
application.use(routerUsers);
application.use(routerMovies);

module.exports = application;
