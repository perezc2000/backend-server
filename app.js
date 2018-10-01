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
var appRoute = require('./routes/app');

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) { throw err; }
    console.log('Database: \x1b[32m%s\x1b[0m', 'online');
});

// Routes
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/', appRoute);

// Listen request
app.listen(3000, () => {
    console.log('Express server \x1b[32m%s\x1b[0m', 'listening', 'on port 3000!');
});