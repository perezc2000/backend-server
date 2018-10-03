var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require("fs");

var app = express();

var Hospital = require("../models/hospital");
var Doctor = require("../models/doctor");
var User = require("../models/user");

// default options
app.use(fileUpload());

app.put("/:collection/:id", (req, res) => {
    var collection = req.params.collection;
    var id = req.params.id;

    // Valid collections
    var validCollections = ["hospitals", "doctors", "users"];

    if (validCollections.indexOf(collection) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Error invalid collection",
            errors: {
                message: "Valid extensions are: " + validCollections.join(", ")
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "Error no files were uploaded",
            errors: { message: "You must select an image" }
        });
    }

    // File name
    var file = req.files.image;
    var nameSplit = file.name.split(".");
    var fileExt = nameSplit[nameSplit.length - 1];

    // Valid extensions
    var validExt = ["png", "jpg", "jpeg", "git", "tiff"];

    if (validExt.indexOf(fileExt) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Error invalid extension",
            errors: { message: "Valid extensions are: " + validExt.join(", ") }
        });
    }

    // Custom name
    var filename = `${id}-${new Date().getMilliseconds()}.${fileExt}`;

    // Moving file
    var path = `./uploads/${filename}`;
    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error moving file",
                errors: err
            });
        }

        setFileToCollection(collection, id, filename, res);
    });
});

function setFileToCollection(collection, id, filename, res) {
    switch (collection) {
        case "hospitals":
            Hospital.findById(id, (err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error searching hospital",
                        errors: err
                    });
                }

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error hospital with ID " + id + " not exists",
                        errors: { message: "Hospital not exists with this ID" }
                    });
                }

                var oldPath = "./uploads/" + hospital.image;

                // Si existe la imagen anterior, se elimina
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }

                hospital.image = filename;
                hospital.save((err, hospitalUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: "Error updating hospital image",
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: "Hospital image updated",
                        hospital: hospitalUpdated
                    });
                });
            });
            break;
        case "doctors":
            Doctor.findById(id, (err, doctor) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error searching doctor",
                        errors: err
                    });
                }

                if (!doctor) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error doctor with ID " + id + " not exists",
                        errors: { message: "Doctor not exists with this ID" }
                    });
                }

                var oldPath = "./uploads/" + doctor.image;

                // Si existe la imagen anterior, se elimina
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath);
                }

                doctor.image = filename;
                doctor.save((err, doctorUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: "Error updating doctor image",
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: "Doctor image updated",
                        doctor: doctorUpdated
                    });
                });
            });
            break;
        case "users":
            User.findById(id, (err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error searching user",
                        errors: err
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error user with ID " + id + " not exists",
                        errors: { message: "User not exists with this ID" }
                    });
                }

                var oldPath = "./uploads/" + user.image;

                // Si existe la imagen anterior, se elimina
                if (fs.existsSync(oldPath)) {
                    fs.unlink(oldPath);
                }

                user.image = filename;
                user.save((err, userUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: "Error updating user image",
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: "Hospital image updated",
                        user: userUpdated
                    });
                });
            });
            break;
    }
}

module.exports = app;