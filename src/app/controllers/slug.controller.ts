import {Request, Response} from 'express';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const createOne = async (req: Request, res: Response) => {
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
        const slug_count = await prisma.posts.count({
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
    } catch (err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const editOne = async (req: Request, res: Response) => {
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
        const slug_count = await prisma.posts.count({
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
    } catch (err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}