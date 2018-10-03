var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// ============================================================
// All search
// ============================================================
app.get('/all/:search', (req, res) => {
    var search = req.params.search;
    var regex = RegExp(search, 'i');

    Promise.all([
            searchHospital(regex),
            searchDoctor(regex),
            searchUser(regex)
        ])
        .then(results => {
            var [hospitals, doctors, users] = results;

            res.status(200).json({
                ok: true,
                hospitals: hospitals,
                doctors: doctors,
                users: users
            });
        })
        .catch(errors => {
            res.status(500).json({
                ok: false,
                message: 'Error in all search',
                errors: errors
            });
        });
});

// ============================================================
// Searchs for collections
// ============================================================
app.get('/collection/:collection/:search', (req, res) => {
    var collection = req.params.collection;
    var search = req.params.search;
    var regex = RegExp(search, 'i');

    var promise;

    switch (collection) {
        case 'hospitals':
            promise = searchHospital(regex);
            break;
        case 'doctors':
            promise = searchDoctor(regex);
            break;
        case 'users':
            promise = searchUser(regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Search types are: hospitals, doctors and users',
                errors: { message: 'Invalid collection' }
            });
    }

    promise
        .then(data => {
            res.status(200).json({
                ok: true,
                [collection]: data
            });
        })
        .catch(errors => {
            res.status(500).json({
                ok: false,
                message: 'Error in ' + [collection] + ' search',
                errors: errors
            });
        });
});

// ============================================================
// Observables for search's
// ============================================================
function searchHospital(regex) {
    return new Promise((resolve, reject) => {
        Hospital
            .find({ 'name': regex })
            .populate('user')
            .exec((err, hospitals) => {
                if (err) {
                    reject('Error searching hospitals', err);
                } else {
                    resolve(hospitals);
                }

            });
    });
}

function searchDoctor(regex) {
    return new Promise((resolve, reject) => {
        Doctor
            .find({ 'name': regex })
            .populate('hospital')
            .populate('user')
            .exec((err, doctors) => {
                if (err) {
                    reject('Error searching doctors', err);
                } else {
                    resolve(doctors);
                }

            });
    });
}

function searchUser(regex) {
    return new Promise((resolve, reject) => {
        User.find()
            .or([{ 'name': regex }, { 'lastname': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error searching users', err);
                } else {
                    resolve(users);
                }

            });
    });
}

module.exports = app;