"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
const cloud_name = (_a = process.env.CD_NAME) !== null && _a !== void 0 ? _a : '';
const api_key = (_b = process.env.CD_API_KEY) !== null && _b !== void 0 ? _b : '';
const api_secret = (_c = process.env.CD_SECRET) !== null && _c !== void 0 ? _c : '';
cloudinary_1.v2.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map