"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_controller_1 = require("../../controllers/post.controller");
const path = "/post";
const Post = (app) => {
    app.post(`${path}/`, post_controller_1.FindAll);
    app.get(`${path}/(:id)`, post_controller_1.FindOne);
    app.post(`${path}/edit/(:id)`, post_controller_1.EditOne);
    app.delete(`${path}/(:id)`, post_controller_1.DeleteOne);
    app.post(`${path}/tambah`, post_controller_1.CreateOne);
    app.post(`${path}/backup`, post_controller_1.Backup);
    app.post(`${path}/reset`, post_controller_1.Reset);
};
exports.default = Post;
//# sourceMappingURL=post.routes.js.map