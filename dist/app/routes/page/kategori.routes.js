"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kategori_controller_1 = require("../../controllers/kategori.controller");
const path = "/kategori";
const Kategori = (app) => {
    app.post(`${path}/`, kategori_controller_1.findAll);
    app.get(`${path}/semua`, kategori_controller_1.WDFindAll);
    app.get(`${path}/(:id)`, kategori_controller_1.findOne);
    app.put(`${path}/(:id)`, kategori_controller_1.editOne);
    app.post(`${path}/tambah`, kategori_controller_1.createOne);
    app.delete(`${path}/(:id)`, kategori_controller_1.deleteOne);
};
exports.default = Kategori;
//# sourceMappingURL=kategori.routes.js.map