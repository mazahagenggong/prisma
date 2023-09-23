import {Request, Response} from 'express';
import {PrismaClient} from "@prisma/client";
import {authenticateToken} from "../utils/jwt";
import {datatable} from "../utils/datatable";
import cloudinary from "../utils/cloudinary";
import moment from "moment";

const prisma = new PrismaClient();
export const FindAll = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
    const sort_by = {created_at: "desc"};

    const data = await datatable(prisma.posts, req, search_list, sort_by);
    res.json(data);
};

export const FindOne = async (req: Request, res: Response) => {
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
    try {
        const data = await prisma.posts.findUnique({
            where: {
                id: id,
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
        const data: any = await prisma.posts.findUnique({
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
        let slug_count = await prisma.posts.count({
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
        body.author = auth?.user?.nama;
        if (body.time) {
            body.created_at = moment(`${body.time} 12:00`, "YYYY-MM-DD HH:mm").utcOffset(420).toDate();
        } else {
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
                    await cloudinary.api.delete_resources([old_image], {
                        type: 'upload',
                        resource_type: 'image'
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            body.gambar = old_image;
        }
        const edit = await prisma.posts.update({
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
    try {
        const data: any = await prisma.posts.findUnique({
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
            await cloudinary.api.delete_resources([old_image], {
                type: 'upload',
                resource_type: 'image'
            });
        }
        await prisma.posts.delete({
            where: {
                id: id,
            }
        });
        res.json({
            success: true,
            message: `Data "${data.judul}" berhasil dihapus`
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
            let time: any = moment(`${body.time} 12:00`, "YYYY-MM-DD HH:mm").utcOffset(420);
            time = time.toDate();
            body.created_at = time;
        } else {
            if (!body.created_at) {
                body.created_at = new Date();
            }
        }
        body.author = auth?.user?.nama;
        try {
            const cek_slug = await prisma.posts.count({
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
            const data = await prisma.posts.create({
                data: body
            });
            res.json({
                success: true,
                message: 'Berhasil menambahkan data',
                data: data
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err
            });
        }
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
        const data = await prisma.posts.findMany({});
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
        await prisma.posts.deleteMany({});

        res.json({
            success: true,
            message: 'Berhasil menghapus semua data'
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({success: false, error: error.message});
    }
}