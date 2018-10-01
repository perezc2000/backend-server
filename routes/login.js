var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user')

app.post('/', (req, res) => {
    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Bad credentials!',
                errors: { message: 'Bad credentials!' }
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Bad credentials!',
                errors: { message: 'Bad credentials!' }
            });
        }

        // Create token!
        var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 hours

        res.status(200).json({
            ok: true,
            user: user,
            token: token,
            id: user._id
        });
    })
});


module.exports = app;