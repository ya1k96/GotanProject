"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("../controller");
var RutaPrincipal = /** @class */ (function () {
    function RutaPrincipal() {
        this.router = express_1.Router();
        this.config();
    }
    RutaPrincipal.prototype.config = function () {
        this.router.get('/', controller_1.principalController.index);
    };
    return RutaPrincipal;
}());
var rutaPrincipal = new RutaPrincipal();
exports.default = rutaPrincipal.router;
