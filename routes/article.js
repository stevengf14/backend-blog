'use strict'

// Cargar archivo de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/application.properties');

var express = require('express');
var ArticleController = require(properties.get('route_article_controllers'));

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: properties.get('route_article_images') }); //Middleware que contiene la dirección de carga de archivos
//var multer = require('multer');
//var upload = multer({ uploadDir: './upload/articles' });

// rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-controlador', ArticleController.test);

// ruta de desarrollo
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);
router.delete('/article/image/:image', ArticleController.deleteImage);

module.exports = router;