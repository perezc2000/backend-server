var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var mdAuthentication = require('../middlewares/authentication');

var User = require('../models/user');

// ============================================================
// Get all users
// ============================================================
app.get('/', (req, res) => {
    User.find({})
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading users',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: users
                });
            });
});

// ============================================================
// Create user
// ============================================================
app.post('/', mdAuthentication.validateToken, (req, res) => {
    var body = req.body;
    var user = new User({
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        rol: body.rol,
        google: body.google
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving user',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });
    });
});

// ============================================================
// Update user
// ============================================================
app.put('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    User.findById(id, (err, user) => {
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
                message: 'Error users with ID ' + id + ' not exists',
                errors: { message: 'User not exists with this ID' }
            });
        }

        Object.keys(req.body).forEach(key => {
            user[key] = req.body[key];
        });

        user.save((err, userUpdated) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user',
                    errors: err
                });
            }

            console.log(req.user);
            res.status(200).json({
                ok: true,
                user: userUpdated,
                userToken: req.user
            });
        });
    });
});

// ============================================================
// Delete user
// ============================================================
app.delete('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndDelete(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Error users with ID ' + id + ' not exists',
                errors: { message: 'User not exists with this ID' }
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted,
            userToken: req.user
        });
    });
});

module.exports = app;