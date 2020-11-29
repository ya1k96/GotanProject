"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var notificacion_schema = new mongoose_1.Schema({
    titulo: String,
    descripcion: String,
    tipo: Number,
    fecha: {
        type: Date,
        default: Date.now()
    },
    usuario_id: String
});
exports.default = mongoose_1.model('Notificacion', notificacion_schema);
