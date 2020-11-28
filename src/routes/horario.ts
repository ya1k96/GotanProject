import { Router } from 'express';
import horarioController from '../controller/horario_controller';

class RutaHorario {
    public router: Router;
    
    constructor() {       
        this.router = Router();
        this.config(); 
    }
    
    config() {
        this.router.post( '/', horarioController.create );
		this.router.post( '/query', horarioController.buscar );
        this.router.post( '/addReserva', horarioController.nuevaReserva );

        this.router.get( '/', horarioController.index );
		this.router.get( '/byId/:id', horarioController.horarioById );
        this.router.get( '/reservasById/:id', horarioController.reservasById );
        this.router.get( '/byUser/:id', horarioController.byUserId );
        this.router.get( '/reserva/:id', horarioController.unaReservaById );
    }
}
const rutaHorario = new RutaHorario();
export default rutaHorario.router;