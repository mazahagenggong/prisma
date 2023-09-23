import {Request, Response} from 'express';
import {PrismaClient} from "@prisma/client";
import {authenticateToken} from "../utils/jwt";
import {datatable} from "../utils/datatable";
import cloudinary from "../utils/cloudinary";

const prisma = new PrismaClient();
export const FindAll = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
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
        const sort_by = {nama: 'asc'};

        const data = await datatable(prisma.guru_and_staffs, req, search_list, sort_by);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
};

export const FindOne = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }

        let id: string;
        if (req.params.id) {
            id = req.params.id as string;
        } else {
            return res.status(400).json({
                success: false,
                message: 'ID tidak ditemukan',
            });
        }
        const data = await prisma.guru_and_staffs.findUnique({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}

export const EditOne = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }

        let id: string;
        if (req.params.id) {
            id = req.params.id as string;
        } else {
            return res.status(400).json({
                success: false,
                message: 'ID tidak ditemukan',
            });
        }
        const data: any = await prisma.guru_and_staffs.findUnique({
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
        const old_image = data?.profile?.image;
        if (body.profile.image) {
            if (old_image !== 'website/gs/gpbe2jttvnhh1egbw6in') {
                await cloudinary.api.delete_resources([old_image], {
                    type: 'upload',
                    resource_type: 'image'
                });
            }
        } else {
            body.profile.image = old_image;
        }
        const edit = await prisma.guru_and_staffs.update({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}

export const DeleteOne = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }

        let id: string;
        if (req.params.id) {
            id = req.params.id as string;
        } else {
            return res.status(400).json({
                success: false,
                message: 'ID tidak ditemukan',
            });
        }
        const data: any = await prisma.guru_and_staffs.findUnique({
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
        const old_image = data?.profile?.image;
        if (old_image !== 'website/gs/gpbe2jttvnhh1egbw6in') {
            await cloudinary.api.delete_resources([old_image], {
                type: 'upload',
                resource_type: 'image'
            });
        }
        await prisma.guru_and_staffs.delete({
            where: {
                id: id,
            }
        });
        res.json({
            success: true,
            message: `Data "${data.nama}" berhasil dihapus`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}

export const CreateOne = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
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
        const create = await prisma.guru_and_staffs.create({
            data: body
        });
        console.log(body)
        res.json({
            success: true,
            message: `Data dengan id berhasil ditambahkan`,
            data: create
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}

export const Backup = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        const data = await prisma.guru_and_staffs.findMany({});
        res.json({
            success: true,
            message: 'Berhasil mendapatkan data',
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
}

export const Reset = async (req: Request, res: Response) => {
    try {
        const auth = await authenticateToken(req, res);
        if (!auth.success) {
            return res.status(auth.code).json({
                success: false,
                message: auth.message,
            });
        }
        await prisma.guru_and_staffs.deleteMany({});

        res.json({
            success: true,
            message: 'Berhasil menghapus semua data'
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({success: false, error: error.message});
    }
}