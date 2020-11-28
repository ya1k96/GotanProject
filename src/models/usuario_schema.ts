import { Schema, model } from 'mongoose';

const userSchema = new Schema({    
    email: {
        type: String,
        validate: {
            validator: RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
            message: 'Error. Correo no valido.'
        },
        unique: true,
        required: true
    },        
    password: {
        type: String,        
    },
    usuario: {
        type: String,
        required: true                        
    },
    is_google: {
        type: Boolean,
        default: false
    },
    is_facebook: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    bus_name: {
        type: String,
        default: null
    },
    push_token: {
        type: String
    } 
}, {timestamps: true});

export default model('Usuario', userSchema);