'use strict'

// Cargar archivo de propiedades
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./config/application.properties');

var validator = require('validator');
var Article = require(properties.get('route_article_models'));
var fs = require('fs');
var path = require('path');
const app = require('../app');

var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Steven Guamán',
            novia: 'Nicole Latorre',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test del controlador de artóculos'
        });
    },

    save: (req, res) => {
        // Recoger parámetros por post
        var params = req.body;
        console.log(params);

        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            });
        }

        if (validate_title && validate_content) {
            // Crear el objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            if (params.image) {
                article.image = params.image;
            } else {
                article.image = null;
            }


            // Guardar artículo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son correctos'
            });
        }
    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        // Find 
        // sort(-_id) ordenar de manera descendente
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Error al devolver los artículos'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'Id incorrecto'
            });
        }

        // Buscar el artículo
        Article.findById(articleId, (err, article) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la consulta de artículos'
                });
            }

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El artículo no existe'
                });
            }

            // Devolver en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });

    },

    update: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;
        console.log(params);

        // Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            // Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar artículo'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el artículo'
                    });
                } else {
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Error en la validación de título o contenido'
            });
        }

    },

    delete: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar artículo, es posible que el artículo no exista'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha eliminado el artículo, es posible que el artículo no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                articleRemoved
            });
        });
    },

    upload: (req, res) => {

        // Configurar el módulo connect multiparty router/article.js

        // Recoger el fichero de la petición

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\'); // cambiar el split para linux o mac

        // Nombre del archivo 
        var file_name = file_split[file_split.length - 1];

        // Extensión del fichero
        var extension_split = file_name.split('.');
        var file_extension = extension_split[extension_split.length - 1];

        // Comprobar la extensión, solo imágenes, si no es válida borrar el fichero
        if (file_extension != 'png' && file_extension != 'jpg' && file_extension != 'jpeg' && file_extension != 'gif') {
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });
        } else {
            // Si todo es válido, sacar la id del url
            var articleId = req.params.id;

            if (articleId) {
                // Buscar el artículo, asignarle el nombre de la imagen y actualizarla
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del artículo'
                        });
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }

        }
    },

    getImage: (req, res) => {

        var file = req.params.image;
        var file_path = properties.get('route_article_images') + file;

        fs.exists(file_path, (exists) => {

            if (exists) {
                return res.sendFile(path.resolve(file_path)); // obtiene el fichero
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {

        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existen artículos que coincidan con \'' + searchString + '\''
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    },

    deleteImage: (req, res) => {

        var file = req.params.image;
        var file_path = properties.get('route_article_images') + file;

        fs.exists(file_path, (exists) => {
            if (exists) {
                fs.unlinkSync(file_path);
                return res.status(200).send({
                    status: 'success',
                    message: 'Archivo eliminado'
                });
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

}; // end controller

module.exports = controller;