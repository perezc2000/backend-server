var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN', 'USER', 'GUEST'],
    message: '{VALUE} no es un rol permitido'
};

var userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    lastname: {
        type: String,
        required: [true, 'El apellido es requerido.']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.']
    },
    image: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'La contraseña es requerida.'],
        uppercase: true,
        enum: validRoles,
        default: 'USER'
    },
    google: {
        type: Boolean,
        default: 'false'

    }
});

// Remove password to return JSON
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} se encuentra registrado.' });

module.exports = mongoose.model('User', userSchema);