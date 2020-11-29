"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrincipalController = /** @class */ (function () {
    function PrincipalController() {
    }
    PrincipalController.prototype.index = function (req, res) {
        res.json({ "mensaje": "Hello World" });
    };
    return PrincipalController;
}());
exports.principalController = new PrincipalController();
