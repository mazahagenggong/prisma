"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../../controllers/auth.controller");
const path = "/auth";
const Auth = (app) => {
    app.post(`${path}/signin`, auth_controller_1.SignIn);
    app.post(`${path}/detail`, auth_controller_1.Detail);
};
exports.default = Auth;
//# sourceMappingURL=auth.routes.js.map