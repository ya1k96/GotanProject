"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Moment = require('moment-timezone');
Moment().tz('America/Buenos_Aires').format();
var schema = new mongoose_1.Schema({
    cupo: {
        type: Number,
        max: 30,
        required: true
    },
    lugares: {
        type: Number,
        max: 30,
        required: false
    },
    hora: {
        type: String,
        required: true
    },
    desde: {
        type: String,
        required: true
    },
    hacia: {
        type: String,
        required: true
    },
    id_admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    pedido_cerrado: {
        type: Boolean,
        default: false
    },
    precio: String,
}, { timestamps: true });
exports.default = mongoose_1.model('Horario', schema);
