import { Request, Response } from 'express';

class PrincipalController {

    public index( req: Request, res: Response ) {
        res.json({ "mensaje": "Hello World" });
    }

}

export const principalController = new PrincipalController();