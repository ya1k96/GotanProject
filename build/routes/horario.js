"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var horario_controller_1 = __importDefault(require("../controller/horario_controller"));
var RutaHorario = /** @class */ (function () {
    function RutaHorario() {
        this.router = express_1.Router();
        this.config();
    }
    RutaHorario.prototype.config = function () {
        this.router.post('/', horario_controller_1.default.create);
        this.router.post('/query', horario_controller_1.default.buscar);
        this.router.post('/addReserva', horario_controller_1.default.nuevaReserva);
        this.router.get('/', horario_controller_1.default.index);
        this.router.get('/byId/:id', horario_controller_1.default.horarioById);
        this.router.get('/reservasById/:id', horario_controller_1.default.reservasById);
        this.router.get('/byUser/:id', horario_controller_1.default.byUserId);
        this.router.get('/reserva/:id', horario_controller_1.default.unaReservaById);
    };
    return RutaHorario;
}());
var rutaHorario = new RutaHorario();
exports.default = rutaHorario.router;
