'use strict';

let express = require("express");
let router = express.Router();
let movieController = require("../controllers/movies");
let auth = require("../helpers/auth");

// Crear peliculas con rol de admin:
router.post("/api/movies", auth.validateToken, auth.requireAdmin, movieController.createMovie);

// Ver todas las peliculas si es user autenticado:
router.get("/api/movies", auth.validateToken, movieController.getAllMovies);

// Buscar pelicula si es user autenticado:
router.get("/api/movies/filter", auth.validateToken, movieController.getMoviesByFilters);

module.exports = router;
