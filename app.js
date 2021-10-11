'use strict'

// Cargar archivo de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/application.properties');

// Cargar módulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros ruta
var artcile_routes = require(properties.get('route_article_routes'));

// Middlewares
//app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// CORS -> Peticiones de front 
// Middleware que controla las peticiones http del front end
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadir prefijos a rutas / Cargar rutas
app.use('/api', artcile_routes);

// Exportar módulo (fichero actual)
module.exports = app; // Permite usar el objeto fuera de este fichero