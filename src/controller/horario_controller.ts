import { Request, Response } from 'express';
import horario_chema from '../models/horario_chema';
import usuario_chema from '../models/usuario_schema';
import reserva_schema from '../models/reserva_schema';
import { Reserva } from '../interfaces/reserva_interface';
import admin from 'firebase-admin';
import notificacion_schema from '../models/notificacion_schema';
var serviceAccount = require("../app/firebase-data.json");
var ObjectId = require('mongoose').Types.ObjectId;

class HorarioController {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    public async index(req: Request, res: Response){
        let destino = req.query.destino;

        const horarios = await horario_chema.find({ hacia: destino })
        .populate('id_admin', 'usuario');

        if( horarios.length === 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'Debes proveer un destino'
            });
        }

        return res.json({ok: true, horarios});
    }
    public create(req: Request, res: Response){
        const body = req.body;

        if(!body) return res.json({
            ok: false,
            message: 'Campos vacios.'
        }); 
        
        if( body.id_admin == null) return res.json({
            ok: false,
            message: 'Id de admin vacio.'
        });

        const nuevoHorario = new horario_chema(body);
        nuevoHorario.save((err,doc) => {
            if( err ) return res.json({ ok: false, error: err.errors });
            
            return res.json({ ok: true, horario: doc });
        });
    }
	public async buscar(req: Request, res: Response){
		const query = req.body.query;
		const reg = new RegExp(query);
        const horarios = await horario_chema.find({ "hora":{ $regex: reg} })
        .populate('id_admin', 'usuario');
	
        return res.json({ok: true, horarios});
    }
    public async horarioById(req: Request, res: Response) {
        const id = req.params.id;
        const horario = await horario_chema.find({ _id: id })
        .populate('id_admin', 'usuario');
    
        return res.json({ok: true, horario});
    }
    public async nuevaReserva(req: Request, res: Response) {
        if(!req.body) {
            return res.json({ok: false, message: 'Error. Provee un argumento valido'});
        }
        const body = JSON.parse(req.body.reserva);
        
        const reserva = {
            horario_id: body.horario_id,
            cantidad: 1,
            usuario_reservado: body.usuario_reservado,
            donde_sube: body.donde_sube
        };
        
        const horario_reserva: any = await horario_chema.findOne({ _id: body.horario_id})
        .populate('id_admin', 'push_token');
        const reservas: any = await reserva_schema.find({horario_id: horario_reserva._id});

        if( horario_reserva.cupo >= reservas.length ) {
            const push_token = horario_reserva.id_admin.push_token;
            const newReserva = new reserva_schema(reserva);
            newReserva.save(async (err, doc) => {
                if( err ) {
                    return res.json(
                        {
                            ok: false, message: 'Error inesperado. Intenta mas tarde.'
                        }
                    );
                }
                const payload = {
                    notification: {
                        title: 'Reserva',
                        body: `Tenes una nueva reserva, mirala.`
                    },
                    data: {
                        'id': doc._id.toString()
                    }
                };
                //fcm Notificacion para el administrador
                await admin.messaging()
                .sendToDevice(push_token, payload);
                //almacenar la notificacion
                await notificacion_schema.create({
                    titulo: payload.notification.title,
                    descripcion: payload.notification.body,
                    usuario_id: horario_reserva.id_admin,
                    tipo: 1
                });
                 
                horario_reserva.cupo = (horario_reserva.cupo - 1);
                    
                if(await horario_reserva.save()) {
                    return res.json({ok: true, message:'Perfecto, añadimos tu pedido!'});
                }else {
                    return res.json({ok: false, message:'Ha ocurrido un error. intenta nuevamente'});
                }

            });

        } else {
            return res.json({ok: false, message: 'No quedan reservas disponibles :('});
        }
    }
    public async byUserId(req: Request, res: Response) {
        const id = req.params.id;
                
        if( id == null ) return res.json({
            ok: false,
            message: 'Provide an id User'
        });
        
        const horarios = await horario_chema.find({}).populate('reservas');

        const horarios_filtrados = horarios.filter((doc:any) => doc.id_admin == id);

        return res.json({
            ok: true,
            horarios: horarios_filtrados
        });
    }
    public async reservasById(req: Request, res: Response){
        const id = req.params.id;
        if( !id ) {
            return res.json({ ok: false });
        }

        const resp = await reserva_schema.find({ usuario_reservado: id }).populate('horario_id', 'hora');

        return res.json({ ok: true, reservas: resp });
    }

    public async unaReservaById(req: Request, res: Response) {
        const id = req.params.id;

        if( !id ) {
            return res.json({
                ok: false,
                message: 'Provide an id of reserva'
            });
        }

        const reserva = await reserva_schema.find({_id: id})
        .populate('usuario_reservado','usuario');

        return res.json({ok: true, reserva});
    }
    
}

const horarioController = new HorarioController();
export default horarioController;