import { Schema, model } from 'mongoose';

const notificacion_schema = new Schema({
    titulo: String,
    descripcion: String,
    tipo: Number,
    fecha: {
        type: Date,
        default: Date.now()
    },
    usuario_id: String
});

export default model('Notificacion', notificacion_schema);
