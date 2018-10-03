var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    image: {
        type: String
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El ID del Hospital es requerido.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido.']
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);