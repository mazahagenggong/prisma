"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../../controllers/user.controller");
const path = "/user";
const User = (app) => {
    app.put(`${path}/password`, user_controller_1.Password);
    app.put(`${path}/profile`, user_controller_1.Profile);
};
exports.default = User;
//# sourceMappingURL=user.routes.js.map