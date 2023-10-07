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
exports.Reset = exports.Backup = exports.CreateOne = exports.DeleteOne = exports.EditOne = exports.FindOne = exports.FindAll = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const datatable_1 = require("../utils/datatable");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const moment_1 = __importDefault(require("moment"));
const prisma = new client_1.PrismaClient();
const FindAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    const search_list = [
        'judul',
        'body',
        'kategori',
        'author'
    ];
    const sort_by = { created_at: "desc" };
    const data = yield (0, datatable_1.datatable)(prisma.posts, req, search_list, sort_by);
    res.json(data);
});
exports.FindAll = FindAll;
const FindOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    let id;
    if (req.params.id) {
        id = req.params.id;
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'ID tidak ditemukan',
        });
    }
    try {
        const data = yield prisma.posts.findUnique({
            where: {
                id: id,
            }
        });
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.FindOne = FindOne;
const EditOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        let id;
        if (req.params.id) {
            id = req.params.id;
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'ID tidak ditemukan',
            });
        }
        const data = yield prisma.posts.findUnique({
            where: {
                id: id,
            }
        });
        const komentar = data.komentar;
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan',
            });
        }
        let body = req.body;
        const required = [
            'judul',
            'slug',
            'body',
            'kategori',
            'excerpt',
            'time',
        ];
        const slug = body.slug;
        let slug_count = yield prisma.posts.count({
            where: {
                NOT: {
                    id: id,
                },
                slug: slug
            }
        });
        if (slug_count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Slug sudah digunakan'
            });
        }
        if (!required.every(key => Object.keys(body).includes(key))) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }
        body.author = (_a = auth === null || auth === void 0 ? void 0 : auth.user) === null || _a === void 0 ? void 0 : _a.nama;
        if (body.time) {
            body.created_at = (0, moment_1.default)(`${body.time} 12:00`, "YYYY-MM-DD HH:mm").utcOffset(420).toDate();
        }
        else {
            if (!body.created_at) {
                body.created_at = new Date();
            }
        }
        body.updated_at = new Date();
        const old_image = data.gambar;
        if (komentar) {
            body.komentar = komentar;
        }
        if (body.gambar) {
            if (old_image !== 'website/post/gpbe2jttvnhh1egbw6in') {
                try {
                    yield cloudinary_1.default.api.delete_resources([old_image], {
                        type: 'upload',
                        resource_type: 'image'
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        else {
            body.gambar = old_image;
        }
        const edit = yield prisma.posts.update({
            where: {
                id: id,
            },
            data: body
        });
        res.json({
            success: true,
            message: `Data dengan id ${id} berhasil diupdate`,
            data: edit
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.EditOne = EditOne;
const DeleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    let id;
    if (req.params.id) {
        id = req.params.id;
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'ID tidak ditemukan',
        });
    }
    try {
        const data = yield prisma.posts.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                judul: true,
            }
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan',
            });
        }
        const old_image = data.gambar;
        if (old_image !== 'website/post/gpbe2jttvnhh1egbw6in') {
            yield cloudinary_1.default.api.delete_resources([old_image], {
                type: 'upload',
                resource_type: 'image'
            });
        }
        yield prisma.posts.delete({
            where: {
                id: id,
            }
        });
        res.json({
            success: true,
            message: `Data "${data.judul}" berhasil dihapus`
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.DeleteOne = DeleteOne;
const CreateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        let body = req.body;
        const required = [
            'judul',
            'slug',
            'body',
            'kategori',
            'excerpt',
        ];
        if (!required.every(key => Object.keys(body).includes(key))) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap'
            });
        }
        const default_image = 'website/post/gpbe2jttvnhh1egbw6in';
        if (!body.gambar) {
            body.gambar = default_image;
        }
        if (body.time) {
            let time = (0, moment_1.default)(`${body.time} 12:00`, "YYYY-MM-DD HH:mm").utcOffset(420);
            time = time.toDate();
            body.created_at = time;
        }
        else {
            if (!body.created_at) {
                body.created_at = new Date();
            }
        }
        body.author = (_b = auth === null || auth === void 0 ? void 0 : auth.user) === null || _b === void 0 ? void 0 : _b.nama;
        try {
            const cek_slug = yield prisma.posts.count({
                where: {
                    slug: body.slug
                }
            });
            if (cek_slug > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Slug sudah digunakan'
                });
            }
            const data = yield prisma.posts.create({
                data: body
            });
            res.json({
                success: true,
                message: 'Berhasil menambahkan data',
                data: data
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.CreateOne = CreateOne;
const Backup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        const data = yield prisma.posts.findMany({});
        res.json({
            success: true,
            message: 'Berhasil mendapatkan data',
            data: data
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.Backup = Backup;
const Reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        yield prisma.posts.deleteMany({});
        res.json({
            success: true,
            message: 'Berhasil menghapus semua data'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.Reset = Reset;
//# sourceMappingURL=post.controller.js.map