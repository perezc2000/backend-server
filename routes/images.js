var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

app.get('/:collection/:image', (req, res) => {
    var collection = req.params.collection;
    var image = req.params.image;

    var pathImage = path.resolve(__dirname, `../uploads/${ image }`);
    var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(pathNoImage);
    }
});

module.exports = app;