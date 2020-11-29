"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    donde_sube: String,
    cantidad: Number,
    horario_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Horario"
    },
    usuario_reservado: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true
});
exports.default = mongoose_1.model('Reserva', schema);
