"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var index_1 = __importDefault(require("../routes/index"));
var usuario_1 = __importDefault(require("../routes/usuario"));
var horario_1 = __importDefault(require("../routes/horario"));
var http_1 = require("http");
var App = /** @class */ (function () {
    function App() {
        this.urlDatabase = 'mongodb://localhost/gotan';
        this.app = express.application = express();
    }
    App.prototype.runConfig = function () {
        //Middlewares
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.setRoutes();
        this.databaseConnect();
        this.startIO();
    };
    App.prototype.startIO = function () {
        this.http = http_1.createServer(this.app);
        //this.io = new MySocket( this.http ).getIO();
        this.http.listen(3000, function () {
            console.log('Server: On');
        });
    };
    App.prototype.setRoutes = function () {
        this.app.use(index_1.default);
        this.app.use('/usuario', usuario_1.default);
        this.app.use('/horario', horario_1.default);
    };
    App.prototype.databaseConnect = function () {
        this.mongoose = mongoose_1.default.connect(this.urlDatabase, { useNewUrlParser: true });
        var db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("Database: On");
        });
    };
    return App;
}());
exports.default = App;
