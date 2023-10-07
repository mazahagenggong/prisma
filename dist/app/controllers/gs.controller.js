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
const prisma = new client_1.PrismaClient();
const FindAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        const search_list = [
            'nama',
            'alamat',
            'jabatan',
            'bidang_studi',
            'no_hp',
        ];
        const sort_by = { nama: 'asc' };
        const data = yield (0, datatable_1.datatable)(prisma.guru_and_staffs, req, search_list, sort_by);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.FindAll = FindAll;
const FindOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield prisma.guru_and_staffs.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                nama: true,
                alamat: true,
                jabatan: true,
                bidang_studi: true,
                no_hp: true,
                profile: true,
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
        const data = yield prisma.guru_and_staffs.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                nama: true,
                alamat: true,
                jabatan: true,
                bidang_studi: true,
                no_hp: true,
                profile: true,
            }
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan',
            });
        }
        let body = req.body;
        if (!body.jenis) {
            return res.status(400).json({
                success: false,
                message: 'Jenis tidak boleh kosong'
            });
        }
        const old_image = (_a = data === null || data === void 0 ? void 0 : data.profile) === null || _a === void 0 ? void 0 : _a.image;
        if (body.profile.image) {
            if (old_image !== 'website/gs/gpbe2jttvnhh1egbw6in') {
                yield cloudinary_1.default.api.delete_resources([old_image], {
                    type: 'upload',
                    resource_type: 'image'
                });
            }
        }
        else {
            body.profile.image = old_image;
        }
        const edit = yield prisma.guru_and_staffs.update({
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
    var _b;
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
        const data = yield prisma.guru_and_staffs.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                nama: true,
            }
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan',
            });
        }
        const old_image = (_b = data === null || data === void 0 ? void 0 : data.profile) === null || _b === void 0 ? void 0 : _b.image;
        if (old_image !== 'website/gs/gpbe2jttvnhh1egbw6in') {
            yield cloudinary_1.default.api.delete_resources([old_image], {
                type: 'upload',
                resource_type: 'image'
            });
        }
        yield prisma.guru_and_staffs.delete({
            where: {
                id: id,
            }
        });
        res.json({
            success: true,
            message: `Data "${data.nama}" berhasil dihapus`
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
exports.DeleteOne = DeleteOne;
const CreateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auth = yield (0, jwt_1.authenticateToken)(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        let body = req.body;
        if (!body) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak boleh kosong'
            });
        }
        if (!body.nama) {
            return res.status(400).json({
                success: false,
                message: 'Nama tidak boleh kosong'
            });
        }
        if (!body.jenis) {
            return res.status(400).json({
                success: false,
                message: 'Jenis tidak boleh kosong'
            });
        }
        body.created_at = new Date();
        const create = yield prisma.guru_and_staffs.create({
            data: body
        });
        console.log(body);
        res.json({
            success: true,
            message: `Data dengan id berhasil ditambahkan`,
            data: create
        });
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
        const data = yield prisma.guru_and_staffs.findMany({});
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
        yield prisma.guru_and_staffs.deleteMany({});
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
//# sourceMappingURL=gs.controller.js.map