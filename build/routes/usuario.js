"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_controller_1 = require("../controller/usuario_controller");
var RutaUsuario = /** @class */ (function () {
    function RutaUsuario() {
        this.router = express_1.Router();
        this.config();
    }
    RutaUsuario.prototype.config = function () {
        this.router.get('/', usuario_controller_1.usuarioController.index);
        this.router.get('/administradores', usuario_controller_1.usuarioController.admins);
        this.router.get('/administradores/cpdh/:id', usuario_controller_1.usuarioController.cerrarPedido);
        this.router.get('/notificaciones/:id', usuario_controller_1.usuarioController.getNotis);
        this.router.get('/pedidos/:id', usuario_controller_1.usuarioController.getPedidos);
        this.router.post('/', usuario_controller_1.usuarioController.create);
        this.router.post('/login', usuario_controller_1.usuarioController.loginUsuario);
        this.router.post('/es_usuario', usuario_controller_1.usuarioController.esUsuario);
        this.router.post('/id', usuario_controller_1.usuarioController.adminById);
        this.router.post('/pedidos/cancelar/:id', usuario_controller_1.usuarioController.cancelarPedido);
    };
    return RutaUsuario;
}());
var rutaUsuario = new RutaUsuario();
exports.default = rutaUsuario.router;
