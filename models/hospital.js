var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.'],
        unique: true
    },
    image: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

hospitalSchema.plugin(uniqueValidator, { message: '{PATH} se encuentra registrado.' });

module.exports = mongoose.model('Hospital', hospitalSchema);