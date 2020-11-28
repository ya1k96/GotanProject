import { Schema, model } from 'mongoose';

const schema = new Schema({
    donde_sube: String,
    cantidad: Number,
    horario_id: {
        type: Schema.Types.ObjectId,
        ref: "Horario"
    },
    usuario_reservado: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    aprobado: {
        type: Boolean,
        default: false        
    },
    cancelado: {
        type: Boolean,
        default: false
    },
    pendiente_aprobacion: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

export default model('Reserva', schema);