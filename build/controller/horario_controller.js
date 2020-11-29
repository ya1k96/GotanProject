"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var horario_chema_1 = __importDefault(require("../models/horario_chema"));
var reserva_schema_1 = __importDefault(require("../models/reserva_schema"));
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var notificacion_schema_1 = __importDefault(require("../models/notificacion_schema"));
var serviceAccount = require("../app/firebase-data.json");
var HorarioController = /** @class */ (function () {
    function HorarioController() {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        });
    }
    HorarioController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var destino, horarios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        destino = req.query.destino;
                        return [4 /*yield*/, horario_chema_1.default.find({ hacia: destino })
                                .populate('id_admin', 'usuario')];
                    case 1:
                        horarios = _a.sent();
                        if (horarios.length === 0) {
                            return [2 /*return*/, res.status(400).json({
                                    ok: false,
                                    msg: 'Debes proveer un destino'
                                })];
                        }
                        return [2 /*return*/, res.json({ ok: true, horarios: horarios })];
                }
            });
        });
    };
    HorarioController.prototype.create = function (req, res) {
        var body = req.body;
        if (!body)
            return res.json({
                ok: false,
                message: 'Campos vacios.'
            });
        if (body.id_admin == null)
            return res.json({
                ok: false,
                message: 'Id de admin vacio.'
            });
        var nuevoHorario = new horario_chema_1.default(body);
        nuevoHorario.save(function (err, doc) {
            if (err)
                return res.json({ ok: false, error: err.errors });
            return res.json({ ok: true, horario: doc });
        });
    };
    HorarioController.prototype.buscar = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var query, reg, horarios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = req.body.query;
                        reg = new RegExp(query);
                        return [4 /*yield*/, horario_chema_1.default.find({ "hora": { $regex: reg } })
                                .populate('id_admin', 'usuario')];
                    case 1:
                        horarios = _a.sent();
                        return [2 /*return*/, res.json({ ok: true, horarios: horarios })];
                }
            });
        });
    };
    HorarioController.prototype.horarioById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, horario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, horario_chema_1.default.find({ _id: id })
                                .populate('id_admin', 'usuario')];
                    case 1:
                        horario = _a.sent();
                        return [2 /*return*/, res.json({ ok: true, horario: horario })];
                }
            });
        });
    };
    HorarioController.prototype.nuevaReserva = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, reserva, horario_reserva, reservas, push_token_1, newReserva;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.body) {
                            return [2 /*return*/, res.json({ ok: false, message: 'Error. Provee un argumento valido' })];
                        }
                        body = JSON.parse(req.body.reserva);
                        reserva = {
                            horario_id: body.horario_id,
                            cantidad: 1,
                            usuario_reservado: body.usuario_reservado,
                            donde_sube: body.donde_sube
                        };
                        return [4 /*yield*/, horario_chema_1.default.findOne({ _id: body.horario_id })
                                .populate('id_admin', 'push_token')];
                    case 1:
                        horario_reserva = _a.sent();
                        return [4 /*yield*/, reserva_schema_1.default.find({ horario_id: horario_reserva._id })];
                    case 2:
                        reservas = _a.sent();
                        if (horario_reserva.cupo >= reservas.length) {
                            push_token_1 = horario_reserva.id_admin.push_token;
                            newReserva = new reserva_schema_1.default(reserva);
                            newReserva.save(function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
                                var payload;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err) {
                                                return [2 /*return*/, res.json({
                                                        ok: false, message: 'Error inesperado. Intenta mas tarde.'
                                                    })];
                                            }
                                            payload = {
                                                notification: {
                                                    title: 'Reserva',
                                                    body: "Tenes una nueva reserva, mirala."
                                                },
                                                data: {
                                                    'id': doc._id.toString()
                                                }
                                            };
                                            //fcm Notificacion para el administrador
                                            return [4 /*yield*/, firebase_admin_1.default.messaging()
                                                    .sendToDevice(push_token_1, payload)];
                                        case 1:
                                            //fcm Notificacion para el administrador
                                            _a.sent();
                                            //almacenar la notificacion
                                            return [4 /*yield*/, notificacion_schema_1.default.create({
                                                    titulo: payload.notification.title,
                                                    descripcion: payload.notification.body,
                                                    usuario_id: horario_reserva.id_admin,
                                                    tipo: 1
                                                })];
                                        case 2:
                                            //almacenar la notificacion
                                            _a.sent();
                                            horario_reserva.cupo = (horario_reserva.cupo - 1);
                                            return [4 /*yield*/, horario_reserva.save()];
                                        case 3:
                                            if (_a.sent()) {
                                                return [2 /*return*/, res.json({ ok: true, message: 'Perfecto, añadimos tu pedido!' })];
                                            }
                                            else {
                                                return [2 /*return*/, res.json({ ok: false, message: 'Ha ocurrido un error. intenta nuevamente' })];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            return [2 /*return*/, res.json({ ok: false, message: 'No quedan reservas disponibles :(' })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HorarioController.prototype.byUserId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, horarios, horarios_filtrados;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (id == null)
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'Provide an id User'
                                })];
                        return [4 /*yield*/, horario_chema_1.default.find({}).populate('reservas')];
                    case 1:
                        horarios = _a.sent();
                        horarios_filtrados = horarios.filter(function (doc) { return doc.id_admin == id; });
                        return [2 /*return*/, res.json({
                                ok: true,
                                horarios: horarios_filtrados
                            })];
                }
            });
        });
    };
    HorarioController.prototype.reservasById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, res.json({ ok: false })];
                        }
                        return [4 /*yield*/, reserva_schema_1.default.find({ usuario_reservado: id }).populate('horario_id', 'hora')];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, res.json({ ok: true, reservas: resp })];
                }
            });
        });
    };
    HorarioController.prototype.unaReservaById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, reserva;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        if (!id) {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'Provide an id of reserva'
                                })];
                        }
                        return [4 /*yield*/, reserva_schema_1.default.find({ _id: id })
                                .populate('usuario_reservado', 'usuario')];
                    case 1:
                        reserva = _a.sent();
                        return [2 /*return*/, res.json({ ok: true, reserva: reserva })];
                }
            });
        });
    };
    return HorarioController;
}());
var horarioController = new HorarioController();
exports.default = horarioController;
