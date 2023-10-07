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
exports.Profile = exports.Password = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const prisma = new client_1.PrismaClient();
const Password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            message: 'Data tidak boleh kosong'
        });
    }
    const required = [
        'password',
        'new_password',
        'confirm_password',
    ];
    for (const field of required) {
        if (body[field] == null || body[field] === '') {
            let the_field;
            switch (field) {
                case 'password':
                    the_field = 'Password lama';
                    break;
                case 'new_password':
                    the_field = 'Password baru';
                    break;
                case 'confirm_password':
                    the_field = 'Konfirmasi password';
                    break;
                default:
                    the_field = field;
                    break;
            }
            return res.status(400).json({
                success: false,
                message: `${the_field} tidak boleh kosong`
            });
        }
    }
    const { password, new_password, confirm_password } = body;
    if (new_password !== confirm_password) {
        return res.status(400).json({
            success: false,
            message: 'Password baru dan konfirmasi password tidak sama'
        });
    }
    if (password === new_password) {
        return res.status(400).json({
            success: false,
            message: 'Password baru tidak boleh sama dengan password lama'
        });
    }
    if (!validator_1.default.isLength(new_password, { min: 8 })) {
        return res.status(400).json({
            success: false,
            message: 'Password baru minimal 8 karakter'
        });
    }
    try {
        const id = (_a = auth === null || auth === void 0 ? void 0 : auth.user) === null || _a === void 0 ? void 0 : _a.id;
        const data = yield prisma.users.findUnique({
            where: {
                id: id,
            }
        });
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        const match = yield bcrypt_1.default.compare(password, data.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Password lama tidak sesuai'
            });
        }
        const new_pw = yield bcrypt_1.default.hash(new_password, 16);
        const ganti = yield prisma.users.update({
            where: {
                id: id,
            },
            data: {
                password: new_pw
            }
        });
        if (!ganti) {
            return res.status(400).json({
                success: false,
                message: 'Gagal mengubah password'
            });
        }
        return res.json({
            success: true,
            message: 'Berhasil mengubah password'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
});
exports.Password = Password;
const Profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    try {
        const id = (_b = auth === null || auth === void 0 ? void 0 : auth.user) === null || _b === void 0 ? void 0 : _b.id;
        const data = yield prisma.users.findUnique({
            where: {
                id: id,
            }
        });
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        const body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak boleh kosong'
            });
        }
        const required = [
            'nama',
            'username',
            'gambar',
            'email'
        ];
        for (const field of required) {
            if (body[field] == null || body[field] === '') {
                let the_field;
                switch (field) {
                    case 'nama':
                        the_field = 'Nama';
                        break;
                    case 'username':
                        the_field = 'Username';
                        break;
                    case 'gambar':
                        the_field = 'Gambar';
                        break;
                    case 'email':
                        the_field = 'Email';
                        break;
                    default:
                        the_field = field;
                        break;
                }
                return res.status(400).json({
                    success: false,
                    message: `${the_field} tidak boleh kosong`
                });
            }
        }
        if (!validator_1.default.isEmail(body.email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak sesuai'
            });
        }
        const { nama, username, gambar, email } = body;
        const user_id = (_d = (_c = auth === null || auth === void 0 ? void 0 : auth.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : '';
        const cek_data = yield prisma.users.findUnique({
            where: {
                id: user_id,
            }
        });
        if (!cek_data) {
            return res.status(400).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        if (cek_data.gambar && cek_data.gambar !== "website/gs/gpbe2jttvnhh1egbw6in") {
            yield cloudinary_1.default.uploader.destroy(cek_data.gambar);
        }
        const update = yield prisma.users.update({
            where: {
                id: user_id,
            },
            data: {
                nama: nama,
                username: username,
                gambar: gambar,
                email: email
            }
        });
        if (!update) {
            return res.status(400).json({
                success: false,
                message: 'Gagal mengubah profile'
            });
        }
        return res.json({
            success: true,
            message: 'Profile berhasil diubah'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
});
exports.Profile = Profile;
//# sourceMappingURL=user.controller.js.map