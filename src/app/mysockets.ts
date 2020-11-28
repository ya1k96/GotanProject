import SocketIO from 'socket.io';
import horario_chema from '../models/horario_chema';
import notificacion_schema from '../models/notificacion_schema';
export class MySocket {
    io: any;
    conectados: any = [];
    admins: any = [];
    usuarios: any = [];
    admin_socket: any;
    user_socket: any;

    constructor(http: any) {
        this.io = SocketIO( http );
        this.config();
    }

    getIO() {
        //this.getAdmins();
        return this.io;
    }

    //async getAdmins() {
    //    this.admins = await usuario_schema.find({ is_admin: true });
    //}

    //setNsps() {
    //    if( this.admins.length != 0 ) {
    //        this.admins.forEach((admin: any) => {
    //            let nsps = '/' + admin.nombre;
    //            this.io.of(nsps, this.adminCb);
    //        });
    //    }
    //}

    newReserva( data: any, admin_socket: any, listaAdmins: any ){
        //console.log( listaAdmins );
        horario_chema.findById({_id: data.horario_id},'horario_id')
        .populate('horario_id', 'id_admin')
        .populate('id_admin', 'id')
        .exec( async (err, doc: any) => {
            //console.log('LISTA ANTES DE NOTIF' + JSON.stringify(listaAdmins));
            //console.log('doc: ' + doc)
            let adminSocketTo = listaAdmins.find((value: any) => value.id == doc.id_admin._id);
            //console.log( 'Adminsocket' + JSON.stringify(adminSocketTo) );
            let newNotif = {
                'titulo'  : 'Nueva reserva',
                'descripcion': data.cantidad,
                'usuario_reservado' : data.usuario_reservado,
                'usuario_id': doc.id_admin._id
            };
            await notificacion_schema.create( newNotif );
            admin_socket.to( adminSocketTo.idSocket ).emit('notif-reserva', data);
        });
        
    }

    config() {
        this.io.on('connection', (client:any) => {
            this.conectados.push( client );
            console.log('Conectado. Total conectados: ', this.conectados.length);
            console.log('Total admins: ',this.admins.length)


            client.on('disconnect', (user: any) => {
                this.conectados = this.conectados.filter( (value: any) => client.id !== value.id );
                console.log('Desconectado. Total conectados: %s', this.conectados.length);
            } );
            //Cuarto no necesario aun
            //this.io.of('/user',(usuario:any) => {
            //    usuario.on('connection', (data:any) => {
            //        console.log('Ingreso un usuario');            
            //    });
            //    
            //    usuario.on('registroU', (data:any) => {
            //        console.log( 'usuario registrado' + data );
            //        
            //    });
            //});
            
            client.on('reserva-client', (data:any) => {this.newReserva(data, this.admin_socket, this.admins);});
            
        });

        this.admin_socket = this.io.of('/admin', (admin:any) => {
            admin.on('registroA', async (data:any) => {
                const newAdmin = {
                    id: data._id,
                    idSocket: admin.id
                };
                //await this.addAdmin( newAdmin );
                this.admins.push( newAdmin );
            });

            this.admin_socket.on('notif-reserva', (data: any) => {
                console.log( 'notif-reserva' );
            });

            admin.on('disconnect', (user: any) => {
                this.admins = this.admins.filter( (value: any) => admin.id !== value.id );
                console.log('Desconectado. Total admins: %s', this.admins.length);
            } );
        });
        
    }

    //addAdmin( admin: any ) {
    //    return new Promise(async (resolve) => {
    //        resolve(await usuario_schema.findByIdAndUpdate(admin.id , { $set: { id_socket: admin.idSocket} }));
    //    });
    //}

}