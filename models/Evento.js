const {Schema, model} = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        //le indica a mongoose que el tipo es una referencia hacia el schema Usuario
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

//para restructurar el objeto y eliminar la propiedad __v, y cambiar la propiedad _id a id
EventoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject()
    object.id = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);

    