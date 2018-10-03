var express = require('express');

var app = express();

var mdAuthentication = require('../middlewares/authentication');

var Doctor = require('../models/doctor');

// ============================================================
// Get all doctors
// ============================================================
app.get('/', (req, res) => {
    var _from = req.body.from || 0;
    var _set = req.body.set || 0;

    _from = Number(_from);
    _set = Number(_set);

    Doctor.find({})
        .skip(_from)
        .limit(_set)
        .populate('user')
        .populate('hospital')
        .exec(
            (err, doctors) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading doctors',
                        errors: err
                    });
                }

                Doctor.countDocuments({}, (err, count) => {
                    res.status(200).json({
                        ok: true,
                        count: count,
                        doctors: doctors
                    });
                });
            });
});

// ============================================================
// Create doctor
// ============================================================
app.post('/', mdAuthentication.validateToken, (req, res) => {
    var body = req.body;
    var doctor = new Doctor({
        name: body.name,
        image: body.image,
        hospital: body.hospital,
        user: req.user._id
    });

    doctor.save((err, doctorSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error saving doctor',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: doctorSaved,
            userToken: req.user,
            id: doctorSaved._id
        });
    });
});

// ============================================================
// Update doctor
// ============================================================
app.put('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding doctor',
                errors: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error doctor with ID ' + id + ' not exists',
                errors: { message: 'Doctor not exists with this ID' }
            });
        }

        Object.keys(req.body).forEach(key => {
            doctor[key] = req.body[key];
        });
        // Update user of updating
        doctor.user = req.user._id;

        doctor.save((err, doctorUpdated) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating doctor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                doctor: doctorUpdated,
                userToken: req.user,
                id: doctorUpdated._id
            });
        });
    });
});

// ============================================================
// Delete doctor
// ============================================================
app.delete('/:id', mdAuthentication.validateToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndDelete(id, (err, doctorDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting doctor',
                errors: err
            });
        }

        if (!doctorDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'Error doctor with ID ' + id + ' not exists',
                errors: { message: 'Doctor not exists with this ID' }
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted,
            userToken: req.user,
            id: doctorDeleted._id
        });
    });
});

module.exports = app;