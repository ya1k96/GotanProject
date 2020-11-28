import { Request, Response } from 'express';
import md5 from 'md5';
import usuario_schema from '../models/usuario_schema';
import horario_chema from '../models/horario_chema';
import reserva_schema from '../models/reserva_schema';
import notificacion_schema from '../models/notificacion_schema';


class UsuarioController {
	constructor(){	
	}

    public async index( req: Request, res: Response ) {
        
        const usuarios = await usuario_schema.find({});

        if( usuarios.length == 0 ) {
            return res.json({
                ok: true,
                message: 'Datos nos disponibles.'
            });
        } else {
            return res.json({usuarios});
        }
    }
	public async admins( req: Request, res: Response ) {
        
        const administradores = await usuario_schema.find({is_admin: true});

        if( administradores.length == 0 ) {
            return res.json({
                ok: false,
                message: 'No hay administradores.'
            });
        } else {
            return res.json({
				ok: true, 
				administradores
			});
        }
	}
	
    public create( req: Request, res: Response ) {
        const body = req.body;
		console.log(body);
        if( !body ) {
            return res.json({
                ok: false,
                message: 'Completa el formulario'
            });
        }
	   const password = (!body.password) ? '': md5(body.password);
       const user = {           
           usuario: body.usuario,
           email: body.email,
           password,
		   is_google: (body.is_google === 'true') ? true : false,
		   is_facebook: (body.is_facebook === 'true') ? true : false
       }
		
	   if(user.is_google || user.is_facebook){
		   user.password = '';
	   }
	   
       const nuevoUsuario = new usuario_schema( user );
       nuevoUsuario.save( (err,doc) => {
        if( err ) {
            var error = err.errors ? err.errors : err;
			console.log( err );
            if(error.code == 11000) {
                error = 'Este correo se encuentra asociado a una cuenta.';
            } else {
                error = 'Error inesperado, intenta nuevamente mas tarde';
            }

            return res.json({ ok: false, errores: error });
        } else {
            return res.json({
                ok: true,
                usuario: doc
            });
        }

       });

    }
	public async loginUsuario(req: Request, res: Response) {

		const body = req.body;
		if( !body ) return res.json({
			ok: false,
			message: 'campos vacios'
		});
		
		const email = body.email;
		const password = body.password;
		
		const usuario: any = await usuario_schema.findOne({email});
		console.log(usuario);

		if( !usuario ){
			return res.json({
				ok: false,
				message: 'Paramteros invalidos'
			});
		}
		
		if( !usuario.is_google || !usuario.is_facebook ) {
			if( md5(password) == usuario.password ){
				usuario.password = '';
				return res.json({
					ok: true,
					usuario
				});
			}
		} else {
			return res.json({
				ok: true,
				usuario
			});
		}
		
		return res.json({
			ok: false,
			message: 'Parametros invalidos'
		});
	}
	public async esUsuario(req: Request, res: Response) {
		const email = req.body.email;
		console.log('aqui papa'+req.body);
		if( email == null ) return res.json({
			ok: false,
			message: 'campo vacios'
		});		
		
		const usuario = await usuario_schema.findOne({email: email});
		console.log(usuario);
		if( usuario == null ){
			return res.json({
				ok: false,
				message: 'Paramteros invalidos'
			});
		}
		
		return res.json({
			ok: true,
			usuario 			
		});
	}
	public async adminById( req: Request, res: Response ){
		const id = req.body.id;
		
		if( !id ){
			return res.json({ ok: false, message: 'Ingresa un id' });
		}
		
		const resp = await usuario_schema.findOne({_id: id});
		
		if( !resp ) return res.json({ok: false, message: 'Sin usuario'});
		
		return res.json({ok: true, usuario: resp});
	}
	// Funcion en mercadopago
	// public mp(req: Request, res: Response) {
	// 	var configurations = {
	// 		qs: {
	// 		  'payer.id': '151888277'
	// 		}
	// 	  };
		  
	// 	  mp.payment.search(configurations, function(payment:any){
	// 		return res.json({ok: true, payment});
	// 	  });		
	// }

	//TODO: Especializar para administradores
	public async cerrarPedido( req: Request, res: Response ) {
		const idHorario = req.params.id;
		
		const pedidos: any = await horario_chema.findOneAndUpdate({_id: idHorario}, {pedido_cerrado: true})
		.populate({
			path: 'reservas',
			select: 'usuario_reservado',
			populate: {
				path: 'usuario_reservado',
				select: 'usuario'
			}
		})					
		console.log(pedidos);
		
		pedidos.reservas.forEach(async (reserva: any) => {
			const reserva_async = await reserva_schema.findOneAndUpdate({_id: reserva._id}, {aprobado: true});
			
			
			const usuario_async = await usuario_schema.findOneAndUpdate({ _id: reserva.usuario_reservado._id }, {notificaciones: {
				title: "Tu reserva fue aprobada",
				msg: "Salida a " + pedidos.hacia,
				salida: pedidos.hora					
			}});
			
					
		});

		return res.json({pedidos});		
	}

	async getNotis(req: Request, res: Response) {
		const id = req.params.id;
		return res.json( await notificacion_schema.find({ usuario_id: id }) );
	}

	async getPedidos(req: Request, res: Response) {
		const id = req.params.id;
		return res.json( 
			await reserva_schema.find({ usuario_reservado: id })
			.populate(
				{ 
					path: 'horario_id', 
					select: ['id_admin','hacia','hora', 'precio'], 
					populate: 
					[
						{ 
							path: 'id_admin', 
							model: 'Usuario', 
							select: 'usuario'
						}
					]
				}
			).sort({createdAt: -1})
			.exec()
		);
	}

	async cancelarPedido(req:Request, res: Response) {
		const body = req.body;
		console.log(body);
		if( !body ) {
			return res.json({ok: false, message: 'Debes proveer un id.'});
		}

		const id = body.id;
		reserva_schema.findByIdAndUpdate(id, { cancelado: true })
		.then((doc: any)  => res.json({ok: true, message: 'Pedido cancelado'}))
		.catch((err: any) => res.json({ ok: false, message: err }));
	}
}

export const usuarioController = new UsuarioController();