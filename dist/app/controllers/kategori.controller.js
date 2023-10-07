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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WDFindAll = exports.editOne = exports.deleteOne = exports.findOne = exports.findAll = exports.createOne = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const datatable_1 = require("../utils/datatable");
const prisma = new client_1.PrismaClient();
const createOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    let body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            message: 'Data tidak boleh kosong'
        });
    }
    const required = [
        'nama',
    ];
    if (!required.every(key => Object.keys(body).includes(key))) {
        return res.status(400).json({
            success: false,
            message: 'Data tidak lengkap'
        });
    }
    body.created_at = new Date();
    try {
        const data = yield prisma.kategoris.create({
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
});
exports.createOne = createOne;
const findAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    const search_list = [
        'nama',
    ];
    const sort_by = { nama: "asc" };
    const data = yield (0, datatable_1.datatable)(prisma.kategoris, req, search_list, sort_by);
    res.json(data);
});
exports.findAll = findAll;
const findOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: 'id tidak boleh kosong!'
        });
    }
    const id = req.params.id;
    try {
        const data = yield prisma.kategoris.findUnique({
            where: {
                id: id
            }
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        res.json({
            success: true,
            message: 'Berhasil mendapatkan data',
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});
exports.findOne = findOne;
const deleteOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: 'id tidak boleh kosong!'
        });
    }
    const id = req.params.id;
    try {
        const data = yield prisma.kategoris.delete({
            where: {
                id: id
            }
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            });
        }
        res.json({
            success: true,
            message: 'Berhasil menghapus data',
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});
exports.deleteOne = deleteOne;
const editOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: 'id tidak boleh kosong!'
        });
    }
    let body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            message: 'Data tidak boleh kosong'
        });
    }
    const id = req.params.id;
    const required = [
        'nama',
    ];
    if (!required.every(key => Object.keys(body).includes(key))) {
        return res.status(400).json({
            success: false,
            message: 'Data tidak lengkap'
        });
    }
    body.updated_at = new Date();
    try {
        const data = yield prisma.kategoris.update({
            where: {
                id: id
            },
            data: body
        });
        res.json({
            success: true,
            message: 'Berhasil mengubah data',
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});
exports.editOne = editOne;
const WDFindAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, jwt_1.authenticateToken)(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    try {
        const data = yield prisma.kategoris.findMany({});
        res.json({
            success: true,
            message: 'Berhasil mendapatkan data',
            data: data
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});
exports.WDFindAll = WDFindAll;
//# sourceMappingURL=kategori.controller.js.map