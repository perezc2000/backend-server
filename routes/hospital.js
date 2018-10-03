var express = require('express');

var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Hospital = require('../models/hospital');

// ============================================================
// Get all hospitals
// ============================================================
app.get('/', (req, res) => {
    var _from = req.body.from || 0;
    var _set = req.body.set || 0;

    _from = Number(_from);
    _set = Number(_set);

    Hospital.find({})
        .skip(_from)
        .limit(_set)
        .populate('user')
        .exec(
            (err, hospitals) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading hospitals',
                        errors: err
                    });
                }

                Hospital.countDocuments({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        count: count,
                        hospitals: hospitals
                    });
                });
            });
});

// ============================================================
// Create hospital
// ============================================================
app.post('/', mdAuthentication.validateToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        name: body.name,
        image: body.image,
        user: req.user._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved,
            userToken: req.user
        });
    });
});

// ============================================================
// Update hospital
// ============================================================
app.put('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'Error hospital with ID ' + id + ' not exists',
                errors: { message: 'Hospital not exists with this ID' }
            });
        }

        Object.keys(req.body).forEach(key => {
            hospital[key] = req.body[key];
        });
        // Update user of updating
        hospital.user = req.user._id;

        hospital.save((err, hospitalUpdated) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalUpdated,
                userToken: req.user
            });
        });
    });
});

// ============================================================
// Delete hospital
// ============================================================
app.delete('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting hospital',
                errors: err
            });
        }

        if (!hospitalDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Error hospital with ID ' + id + ' not exists',
                errors: { message: 'Hospital not exists with this ID' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted,
            userToken: req.user
        });
    });
});

module.exports = app;