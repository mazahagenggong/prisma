"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slug_controller_1 = require("../../controllers/slug.controller");
const path = "/slug";
const Slug = (app) => {
    app.post(`${path}/`, slug_controller_1.createOne);
    app.post(`${path}/edit`, slug_controller_1.editOne);
};
exports.default = Slug;
//# sourceMappingURL=slug.routes.js.map