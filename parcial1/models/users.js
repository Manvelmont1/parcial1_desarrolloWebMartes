'use strict'

let mongoose = require("mongoose");

// Valores de Users:
let UserSchema = mongoose.Schema({
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'basic'],
        default: 'basic'
    }
});

module.exports = mongoose.model("users", UserSchema);