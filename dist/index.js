"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./app/routes/page/auth.routes"));
const post_routes_1 = __importDefault(require("./app/routes/page/post.routes"));
const gs_routes_1 = __importDefault(require("./app/routes/page/gs.routes"));
const slug_routes_1 = __importDefault(require("./app/routes/page/slug.routes"));
const kategori_routes_1 = __importDefault(require("./app/routes/page/kategori.routes"));
const user_routes_1 = __importDefault(require("./app/routes/page/user.routes"));
const app = (0, express_1.default)();
const PORT = 3000;
const allowed = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://mazainulhasan1.sch.id',
    'https://www.mazainulhasan1.sch.id',
    'https://web-ma-nextjs.vercel.app',
];
const corsOptions = {
    origin: allowed,
};
dotenv_1.default.config();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "cari apa bre?" });
});
(0, auth_routes_1.default)(app);
(0, gs_routes_1.default)(app);
(0, post_routes_1.default)(app);
(0, slug_routes_1.default)(app);
(0, kategori_routes_1.default)(app);
(0, user_routes_1.default)(app);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map