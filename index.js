'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

//forzar a que métodos antiguos se desactiven
mongoose.set('useFindAndModify', false);
//Funcionamiento interno de mongoose
mongoose.Promise = global.Promise;
//Conexión mongoose
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true , useUnifiedTopology: true })
        .then(() =>{
            console.log('Conexión a base de datos OK');

            //Creación del servidor 
            //Escuchar peticiones http
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port+'/');
            });
    });