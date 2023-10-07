"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detail = exports.SignIn = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, password, remember } = req.body;
        if (!username || !password) {
            return res
                .status(403)
                .json({ message: "Username dan password harus diisi" });
        }
        const user = yield prisma.users.findUnique({
            where: { username: username },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        let expires;
        let kadaluarsa;
        if (remember) {
            expires = '7d';
            kadaluarsa = '7 hari';
        }
        else {
            expires = '1d';
            kadaluarsa = '1 hari';
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '', {
            expiresIn: expires,
        });
        let data = {
            id: user.id,
            nama: user.nama,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
            expires: kadaluarsa
        };
        return res.json({
            success: true,
            message: 'Berhasil login',
            data: data
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.SignIn = SignIn;
const Detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ada'
        });
    }
    try {
        const cek_token = jsonwebtoken_1.default.verify(token, (_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : '');
        if (!cek_token.id) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }
        const id_user = (_d = yield cek_token.id) !== null && _d !== void 0 ? _d : 'xxx';
        const user = yield prisma.users.findUnique({
            where: { id: id_user },
            select: {
                id: true,
                username: true,
                email: true,
                nama: true,
                gambar: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
});
exports.Detail = Detail;
//# sourceMappingURL=auth.controller.js.map