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
var socket_io_1 = __importDefault(require("socket.io"));
var horario_chema_1 = __importDefault(require("../models/horario_chema"));
var notificacion_schema_1 = __importDefault(require("../models/notificacion_schema"));
var MySocket = /** @class */ (function () {
    function MySocket(http) {
        this.conectados = [];
        this.admins = [];
        this.usuarios = [];
        this.io = socket_io_1.default(http);
        this.config();
    }
    MySocket.prototype.getIO = function () {
        //this.getAdmins();
        return this.io;
    };
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
    MySocket.prototype.newReserva = function (data, admin_socket, listaAdmins) {
        var _this = this;
        //console.log( listaAdmins );
        horario_chema_1.default.findById({ _id: data.horario_id }, 'horario_id')
            .populate('horario_id', 'id_admin')
            .populate('id_admin', 'id')
            .exec(function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
            var adminSocketTo, newNotif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminSocketTo = listaAdmins.find(function (value) { return value.id == doc.id_admin._id; });
                        newNotif = {
                            'titulo': 'Nueva reserva',
                            'descripcion': data.cantidad,
                            'usuario_reservado': data.usuario_reservado,
                            'usuario_id': doc.id_admin._id
                        };
                        return [4 /*yield*/, notificacion_schema_1.default.create(newNotif)];
                    case 1:
                        _a.sent();
                        admin_socket.to(adminSocketTo.idSocket).emit('notif-reserva', data);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MySocket.prototype.config = function () {
        var _this = this;
        this.io.on('connection', function (client) {
            _this.conectados.push(client);
            console.log('Conectado. Total conectados: ', _this.conectados.length);
            console.log('Total admins: ', _this.admins.length);
            client.on('disconnect', function (user) {
                _this.conectados = _this.conectados.filter(function (value) { return client.id !== value.id; });
                console.log('Desconectado. Total conectados: %s', _this.conectados.length);
            });
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
            client.on('reserva-client', function (data) { _this.newReserva(data, _this.admin_socket, _this.admins); });
        });
        this.admin_socket = this.io.of('/admin', function (admin) {
            admin.on('registroA', function (data) { return __awaiter(_this, void 0, void 0, function () {
                var newAdmin;
                return __generator(this, function (_a) {
                    newAdmin = {
                        id: data._id,
                        idSocket: admin.id
                    };
                    //await this.addAdmin( newAdmin );
                    this.admins.push(newAdmin);
                    return [2 /*return*/];
                });
            }); });
            _this.admin_socket.on('notif-reserva', function (data) {
                console.log('notif-reserva');
            });
            admin.on('disconnect', function (user) {
                _this.admins = _this.admins.filter(function (value) { return admin.id !== value.id; });
                console.log('Desconectado. Total admins: %s', _this.admins.length);
            });
        });
    };
    return MySocket;
}());
exports.MySocket = MySocket;
