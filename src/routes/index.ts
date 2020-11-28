import { Router } from 'express';
import { principalController } from '../controller';

class RutaPrincipal {
    public router: Router = Router();
    
    constructor() {
        this.config();
    }

    private config() : void {
        this.router.get( '/', principalController.index );
    }
}

const rutaPrincipal = new RutaPrincipal();
export default rutaPrincipal.router;