'use strict';

let Movie = require("../models/movies");

function createMovie(req, resp) {
    let requestBody = req.body;

    if (!requestBody) {
        return resp.status(400).send({"message": "El body no fue enviado o es invalido"});
    }
    
    if (!requestBody.title || !requestBody.director || !requestBody.releaseYear || !requestBody.producer || requestBody.price === undefined) {
        return resp.status(400).send({"message": "Estos valores son necesarios: (title, director, releaseYear, producer, price)"});
    }
    
    if (!requestBody.title.trim() || !requestBody.director.trim() || !requestBody.producer.trim()) {
        return resp.status(400).send({"message": "Title, director y producer estan vacios!"});
    }
    
    if (requestBody.releaseYear <= 0 || requestBody.price < 0) {
        return resp.status(400).send({"message": "El releaseYear y price deben ser mayores a cero"});
    }
    
    // Añadir nueva movie:
    let newMovie = new Movie();
    newMovie.title = requestBody.title.trim();
    newMovie.director = requestBody.director.trim();
    newMovie.releaseYear = requestBody.releaseYear;
    newMovie.producer = requestBody.producer.trim();
    newMovie.price = requestBody.price;

    newMovie.save().then(
        (savedMovie) => {
            resp.status(201).send({
                "message": "Pelicula creada!", 
                "movie": savedMovie
            });
        },
        err => {
            resp.status(500).send({"message": "Error al crearse la pelicula", "error": err});
        }
    );
}

function getAllMovies(req, resp) {
    Movie.find({}).then(
        (movies) => {
            resp.status(200).send({
                "message": "Lista de peliculas",
                "movies": movies,
                "count": movies.length
            });
        },
        err => {
            resp.status(500).send({"message": "Error al mostrar las peliculas", "error": err});
        }
    );
}

function getMoviesByFilters(req, resp) {
    let minYear = req.query.minYear;
    let maxPrice = req.query.maxPrice;
    
    // Condicionales de año y precio:
    if (!minYear || !maxPrice) {
        return resp.status(400).send({
            "message": "Se necesita añadir valores para minYear y maxPrice",
            "example": "/api/movies/filter?minYear=2000&maxPrice=25.99"
        });
    }
    
    minYear = parseInt(minYear);
    maxPrice = parseFloat(maxPrice);
    
    if (isNaN(minYear) || isNaN(maxPrice)) {
        return resp.status(400).send({"message": "minYear y maxPrice deben ser valores validos"});
    }
    
    if (minYear < 1900 || maxPrice < 0) {
        return resp.status(400).send({"message": "El minYear y price deben ser mayor a 1900 y 0 respectivamente"});
    }
    
    // Buscar movies:
    Movie.find({
        releaseYear: { $gt: minYear },
        price: { $lte: maxPrice }
    }).then(
        (movies) => {
            resp.status(200).send({
                "message": "Peliculas encontradas",
                "filters": {
                    "releaseYear": `> ${minYear}`,
                    "price": `<= ${maxPrice}`
                },
                "movies": movies,
                "count": movies.length
            });
        },
        err => {
            resp.status(500).send({"message": "Error al buscarse las peliculas", "error": err});
        }
    );
}

module.exports = { createMovie, getAllMovies, getMoviesByFilters };
