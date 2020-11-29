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
var md5_1 = __importDefault(require("md5"));
var usuario_schema_1 = __importDefault(require("../models/usuario_schema"));
var horario_chema_1 = __importDefault(require("../models/horario_chema"));
var reserva_schema_1 = __importDefault(require("../models/reserva_schema"));
var notificacion_schema_1 = __importDefault(require("../models/notificacion_schema"));
var UsuarioController = /** @class */ (function () {
    function UsuarioController() {
    }
    UsuarioController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var usuarios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usuario_schema_1.default.find({})];
                    case 1:
                        usuarios = _a.sent();
                        if (usuarios.length == 0) {
                            return [2 /*return*/, res.json({
                                    ok: true,
                                    message: 'Datos nos disponibles.'
                                })];
                        }
                        else {
                            return [2 /*return*/, res.json({ usuarios: usuarios })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //WTF: no entiendo porque puse esto
    UsuarioController.prototype.admins = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var administradores;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usuario_schema_1.default.find({ is_admin: true })];
                    case 1:
                        administradores = _a.sent();
                        if (administradores.length == 0) {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'No hay administradores.'
                                })];
                        }
                        else {
                            return [2 /*return*/, res.json({
                                    ok: true,
                                    administradores: administradores
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsuarioController.prototype.create = function (req, res) {
        var body = req.body;
        console.log(body);
        if (!body) {
            return res.json({
                ok: false,
                message: 'Completa el formulario'
            });
        }
        if (body.is_google || body.is_facebook) {
            body.password = '';
        }
        var password = md5_1.default(body.password);
        var user = {
            usuario: body.usuario,
            email: body.email,
            password: password,
            is_google: (body.is_google === 'true') ? true : false,
            is_facebook: (body.is_facebook === 'true') ? true : false
        };
        var nuevoUsuario = new usuario_schema_1.default(user);
        nuevoUsuario.save(function (err, doc) {
            if (err) {
                var error = err.errors ? err.errors : err;
                console.log(err);
                if (error.code == 11000) {
                    error = 'Este correo se encuentra asociado a una cuenta.';
                }
                else {
                    error = 'Error inesperado, intenta nuevamente mas tarde';
                }
                return res.json({ ok: false, errores: error });
            }
            else {
                return res.json({
                    ok: true,
                    usuario: doc
                });
            }
        });
    };
    UsuarioController.prototype.loginUsuario = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, email, password, usuario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = req.body;
                        if (!body)
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'campos vacios'
                                })];
                        email = body.email;
                        password = body.password;
                        return [4 /*yield*/, usuario_schema_1.default.findOne({ email: email })];
                    case 1:
                        usuario = _a.sent();
                        console.log(usuario);
                        if (!usuario) {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'Paramteros invalidos'
                                })];
                        }
                        if (!(usuario.is_google || usuario.is_facebook)) {
                            if (md5_1.default(password) == usuario.password) {
                                usuario.password = '';
                                return [2 /*return*/, res.json({
                                        ok: true,
                                        usuario: usuario
                                    })];
                            }
                        }
                        else {
                            return [2 /*return*/, res.json({
                                    ok: true,
                                    usuario: usuario
                                })];
                        }
                        return [2 /*return*/, res.json({
                                ok: false,
                                message: 'Parametros invalidos'
                            })];
                }
            });
        });
    };
    UsuarioController.prototype.esUsuario = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, usuario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.body.email;
                        console.log('aqui papa' + req.body);
                        if (email == null)
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'campo vacios'
                                })];
                        return [4 /*yield*/, usuario_schema_1.default.findOne({ email: email })];
                    case 1:
                        usuario = _a.sent();
                        console.log(usuario);
                        if (usuario == null) {
                            return [2 /*return*/, res.json({
                                    ok: false,
                                    message: 'Paramteros invalidos'
                                })];
                        }
                        return [2 /*return*/, res.json({
                                ok: true,
                                usuario: usuario
                            })];
                }
            });
        });
    };
    UsuarioController.prototype.adminById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.body.id;
                        if (!id) {
                            return [2 /*return*/, res.json({ ok: false, message: 'Ingresa un id' })];
                        }
                        return [4 /*yield*/, usuario_schema_1.default.findOne({ _id: id })];
                    case 1:
                        resp = _a.sent();
                        if (!resp)
                            return [2 /*return*/, res.json({ ok: false, message: 'Sin usuario' })];
                        return [2 /*return*/, res.json({ ok: true, usuario: resp })];
                }
            });
        });
    };
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
    UsuarioController.prototype.cerrarPedido = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idHorario, pedidos;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idHorario = req.params.id;
                        return [4 /*yield*/, horario_chema_1.default.findOneAndUpdate({ _id: idHorario }, { pedido_cerrado: true })
                                .populate({
                                path: 'reservas',
                                select: 'usuario_reservado',
                                populate: {
                                    path: 'usuario_reservado',
                                    select: 'usuario'
                                }
                            })];
                    case 1:
                        pedidos = _a.sent();
                        console.log(pedidos);
                        pedidos.reservas.forEach(function (reserva) { return __awaiter(_this, void 0, void 0, function () {
                            var reserva_async, usuario_async;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, reserva_schema_1.default.findOneAndUpdate({ _id: reserva._id }, { aprobado: true })];
                                    case 1:
                                        reserva_async = _a.sent();
                                        return [4 /*yield*/, usuario_schema_1.default.findOneAndUpdate({ _id: reserva.usuario_reservado._id }, { notificaciones: {
                                                    title: "Tu reserva fue aprobada",
                                                    msg: "Salida a " + pedidos.hacia,
                                                    salida: pedidos.hora
                                                } })];
                                    case 2:
                                        usuario_async = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, res.json({ pedidos: pedidos })];
                }
            });
        });
    };
    UsuarioController.prototype.getNotis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = req.params.id;
                        _b = (_a = res).json;
                        return [4 /*yield*/, notificacion_schema_1.default.find({ usuario_id: id })];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    UsuarioController.prototype.getPedidos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = req.params.id;
                        _b = (_a = res).json;
                        return [4 /*yield*/, reserva_schema_1.default.find({ usuario_reservado: id })
                                .populate({
                                path: 'horario_id',
                                select: ['id_admin', 'hacia', 'hora', 'precio'],
                                populate: [
                                    {
                                        path: 'id_admin',
                                        model: 'Usuario',
                                        select: 'usuario'
                                    }
                                ]
                            }).sort({ createdAt: -1 })
                                .exec()];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    UsuarioController.prototype.cancelarPedido = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var body, id;
            return __generator(this, function (_a) {
                body = req.body;
                console.log(body);
                if (!body) {
                    return [2 /*return*/, res.json({ ok: false, message: 'Debes proveer un id.' })];
                }
                id = body.id;
                reserva_schema_1.default.findByIdAndUpdate(id, { cancelado: true })
                    .then(function (doc) { return res.json({ ok: true, message: 'Pedido cancelado' }); })
                    .catch(function (err) { return res.json({ ok: false, message: err }); });
                return [2 /*return*/];
            });
        });
    };
    return UsuarioController;
}());
exports.usuarioController = new UsuarioController();
