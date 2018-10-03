// Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')

// Inicialization of variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Import Routes
var userRoute = require('./routes/user');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var doctorRoute = require('./routes/doctor');
var searchRoute = require('./routes/search');
var uploadRoute = require('./routes/upload');
var imagesRoute = require('./routes/images');
var appRoute = require('./routes/app');

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) { throw err; }
    console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});

// Sample code for show files from server - Not do
// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Routes
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/hospital', hospitalRoute);
app.use('/doctor', doctorRoute);
app.use('/search', searchRoute);
app.use('/upload', uploadRoute);
app.use('/images', imagesRoute);
app.use('/', appRoute);

// Listen request
app.listen(3000, () => {
    console.log('Express server \x1b[32m%s\x1b[0m', 'listening', 'on port 3000!');
});