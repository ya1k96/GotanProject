import { Schema, model } from 'mongoose';
var Moment = require('moment-timezone'); Moment().tz('America/Buenos_Aires').format();

const schema = new Schema({
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
        type: Schema.Types.ObjectId, 
        ref: "Usuario", 
        required: true
    },
    pedido_cerrado: {
        type: Boolean,
        default: false
    },
    precio: String,
    
}, {timestamps:true});

export default model('Horario', schema);