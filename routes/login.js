var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

// ============================================================
// Google Authentication
// ============================================================
var CLIENT_ID = require('../config/config').CLIENT_ID;
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

// ============================================================
// Local authentication
// ============================================================
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
    });
});

// ============================================================
// Google authentication
// ============================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.given_name,
        lastname: payload.family_name,
        email: payload.email,
        image: payload.picture,
        google: true,
        payload: payload
    };
}

app.post('/google', async(req, res) => {
    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'Invalid Google token!',
                errors: err
            });
        });

    // return res.status(200).json({
    //     ok: true,
    //     message: 'Google user!',
    //     googleUser: googleUser
    // });

    User.findOne({ email: googleUser.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });
        }

        if (user) {
            if (!user.google) {
                return res.status(403).json({
                    ok: false,
                    message: 'Must use your authentication normal',
                    errors: { message: 'User exists with other authentication' }
                });
            } else {
                // Create token!
                var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 hours

                res.status(200).json({
                    ok: true,
                    user: user,
                    token: token,
                    id: user._id
                });

            }
        } else {
            var userNew = new User({
                name: googleUser.name,
                lastname: googleUser.lastname,
                email: googleUser.email,
                password: ':=)',
                image: googleUser.image,
                rol: 'ADMIN',
                google: true
            });

            userNew.save((err, userSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error saving user',
                        errors: err
                    });
                }

                // Create token!
                var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }); // 4 hours

                res.status(200).json({
                    ok: true,
                    user: userSaved,
                    token: token,
                    id: userSaved._id
                });
            });

        }

    });
});

module.exports = app;