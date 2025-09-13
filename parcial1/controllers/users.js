'use strict'

let User = require("../models/users");
let token = require("../helpers/auth");
let bcrypt = require("bcryptjs");

function createUser(req, resp){
    let requestBody = req.body;
    
    if (!requestBody) {
        return resp.status(400).send({"message": "El body no fue enviado o es invalido"});
    }
    
    if (!requestBody.email || !requestBody.password) {
        return resp.status(400).send({"message": "Email y Password son requeridos"});
    }
    
    if (!requestBody.email.trim() || !requestBody.password.trim()) {
        return resp.status(400).send({"message": "Email y password no pueden estar vacios"});
    }
    
    // Validar email:
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestBody.email)) {
        return resp.status(400).send({"message": "Email invalido"});
    }

    // Ver si ya existe el user segun el email:
    User.findOne({"email": requestBody.email}).then(
        (existingUser) => {
            if (existingUser) {
                return resp.status(409).send({"message": "Ya existe un User con este Email"});
            }
            
            // Crear nuevo user:
            let salt = bcrypt.genSaltSync(15);
            let newUser = new User();
            newUser.email = requestBody.email;
            newUser.password = bcrypt.hashSync(requestBody.password, salt);
            newUser.role = requestBody.role === 'admin' ? 'admin' : 'basic';
            
            newUser.save().then(
                (userSaved) => {

                    let userResponse = {
                        _id: userSaved._id,
                        email: userSaved.email,
                        role: userSaved.role
                    };
                    resp.status(201).send({
                        "message": "User creado",
                        "user": userResponse
                    });
                },
                err => {
                    resp.status(500).send({"message": "Error en la creacion del user", "error": err});
                }
            );
        },
        err => {
            resp.status(500).send({"message": "Error durante la verificacion de user existente", "error": err});
        }
    );
}

function loginUser(req, resp){
    if (!req.body.email || !req.body.password) {
        return resp.status(400).send({"message": "Se necesita ingresar Email y password"});
    }
    
    User.findOne({"email": req.body.email}).then(
        (userFound) => {
            if (userFound == null) {
                return resp.status(404).send({"message": "El User no existe"});
            }

            if (bcrypt.compareSync(req.body.password, userFound.password)) {
                resp.status(200).send({
                    "message": "Login exitoso!", 
                    "token": token.generateToken(userFound),
                    "user": {
                        email: userFound.email,
                        role: userFound.role
                    }
                });
            } else {
                resp.status(401).send({"message": "password incorrecta"});
            }
        },
        err => {
            resp.status(500).send({"message": "Error durante el login", "error": err});
        }
    );
}

module.exports = {createUser, loginUser}
