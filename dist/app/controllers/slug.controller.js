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
exports.editOne = exports.createOne = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Body tidak boleh kosong!'
        });
    }
    if (!req.body.judul) {
        return res.status(400).json({
            success: false,
            message: 'judul tidak boleh kosong!'
        });
    }
    let slug = req.body.judul.replace(/[^A-Za-z0-9-]+/g, '-').toLowerCase();
    try {
        const slug_count = yield prisma.posts.count({
            where: {
                slug: slug
            }
        });
        if (slug_count > 0) {
            slug = slug + '-' + (slug_count + 1);
        }
        return res.json({
            success: true,
            message: 'Berhasil membuat slug',
            slug: slug
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.createOne = createOne;
const editOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'Body tidak boleh kosong!'
        });
    }
    if (!req.body.id) {
        return res.status(400).json({
            success: false,
            message: 'id tidak boleh kosong!'
        });
    }
    if (!req.body.judul) {
        return res.status(400).json({
            success: false,
            message: 'judul tidak boleh kosong!'
        });
    }
    let slug = req.body.judul.replace(/[^A-Za-z0-9-]+/g, '-').toLowerCase();
    try {
        const slug_count = yield prisma.posts.count({
            where: {
                NOT: {
                    id: req.params.id
                },
                slug: slug
            }
        });
        if (slug_count > 0) {
            slug = slug + '-' + (slug_count + 1);
        }
        return res.json({
            success: true,
            message: 'Berhasil membuat slug',
            slug: slug
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.editOne = editOne;
//# sourceMappingURL=slug.controller.js.map