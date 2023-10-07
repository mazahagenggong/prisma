"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gs_controller_1 = require("../../controllers/gs.controller");
const path = "/gs";
const GS = (app) => {
    app.post(`${path}/`, gs_controller_1.FindAll);
    app.get(`${path}/(:id)`, gs_controller_1.FindOne);
    app.post(`${path}/edit/(:id)`, gs_controller_1.EditOne);
    app.delete(`${path}/(:id)`, gs_controller_1.DeleteOne);
    app.post(`${path}/tambah`, gs_controller_1.CreateOne);
    app.post(`${path}/backup`, gs_controller_1.Backup);
    app.post(`${path}/reset`, gs_controller_1.Reset);
};
exports.default = GS;
//# sourceMappingURL=gs.routes.js.map