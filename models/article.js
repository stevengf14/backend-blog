'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticheSchema = Schema ({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});

module.exports = mongoose.model('Article', ArticheSchema);
// articles --> guarda documentos de este tipo y con esta estructura
//              dentro de la colección
