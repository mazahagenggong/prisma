import {Request, Response} from 'express';
import {PrismaClient} from "@prisma/client";
import {authenticateToken} from "../utils/jwt";
import {datatable} from "../utils/datatable";

const prisma = new PrismaClient();
export const createOne = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
        const data = await prisma.kategoris.create({
            data: body
        });
        res.json({
            success: true,
            message: 'Berhasil menambahkan data',
            data: data
        });
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

export const findAll = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    const search_list = [
        'nama',
    ];
    const sort_by = {nama: "asc"};
    const data = await datatable(prisma.kategoris, req, search_list, sort_by);
    res.json(data);
}

export const findOne = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
        const data = await prisma.kategoris.findUnique({
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
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

export const deleteOne = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
        const data = await prisma.kategoris.delete({
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
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

export const editOne = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
        const data = await prisma.kategoris.update({
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
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

export const WDFindAll = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message
        });
    }
    try {
        const data = await prisma.kategoris.findMany({});
        res.json({
            success: true,
            message: 'Berhasil mendapatkan data',
            data: data
        });
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}