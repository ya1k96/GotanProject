import express = require('express');
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import rutaPrincipal from '../routes/index';
import rutaUsuario from '../routes/usuario';
import rutaHorario from '../routes/horario';
import { createServer } from 'http'; 


export default class App {
   public app: any;
   public mongoose: any;
   private urlDatabase = 'mongodb://localhost/gotan';
   private http: any;

    constructor() {
        this.app = express.application = express();        
    }
    
    public runConfig() {

      //Middlewares
      this.app.use( bodyParser.json() );
      this.app.use( bodyParser.urlencoded({ extended: true }) );

      this.setRoutes();
      this.databaseConnect();
      this.startIO();
    }

    private startIO() {
        this.http = createServer( this.app );
        //this.io = new MySocket( this.http ).getIO();
        
        this.http.listen(3000, function () {
            console.log('Server: On');
        });

    }


    private setRoutes() {
        this.app.use( rutaPrincipal );
        this.app.use( '/usuario' , rutaUsuario );
        this.app.use( '/horario' , rutaHorario );
    }

    private databaseConnect() {
        this.mongoose = mongoose.connect(this.urlDatabase, { useNewUrlParser: true });        
        const db = mongoose.connection;
        
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log("Database: On");
        });
    }
}
