import { Router } from 'express';
import { usuarioController } from '../controller/usuario_controller';


class RutaUsuario {
    public router: Router = Router();
    
    constructor() {
        this.config();
    }

    private config() : void {
        
        this.router.get( '/', usuarioController.index );		
		this.router.get( '/administradores', usuarioController.admins );
        this.router.get( '/administradores/cpdh/:id', usuarioController.cerrarPedido );
        this.router.get( '/notificaciones/:id', usuarioController.getNotis );
        this.router.get( '/pedidos/:id', usuarioController.getPedidos );

        this.router.post( '/', usuarioController.create );
		this.router.post( '/login', usuarioController.loginUsuario );
		this.router.post( '/es_usuario', usuarioController.esUsuario );
        this.router.post( '/id', usuarioController.adminById );

        this.router.post( '/pedidos/cancelar/:id', usuarioController.cancelarPedido );
    }
}

const rutaUsuario = new RutaUsuario();
export default rutaUsuario.router;