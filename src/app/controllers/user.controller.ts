import {Request, Response} from 'express';
import {PrismaClient} from "@prisma/client";
import {authenticateToken} from "../utils/jwt";
import cloudinary from "../utils/cloudinary";
import moment from "moment";
import bcrypt from "bcrypt";
import validator from 'validator';

const prisma = new PrismaClient();

export const Password = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
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
    const {password, new_password, confirm_password} = body;
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
    if (!validator.isLength(new_password, {min: 8})) {
        return res.status(400).json({
            success: false,
            message: 'Password baru minimal 8 karakter'
        });
    }
    try {
        const id = auth?.user?.id;
        const data = await prisma.users.findUnique({
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
        const match = await bcrypt.compare(password, data.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Password lama tidak sesuai'
            });
        }
        const new_pw = await bcrypt.hash(new_password, 16);
        const ganti = await prisma.users.update({
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}

export const Profile = async (req: Request, res: Response) => {
    const auth = await authenticateToken(req, res);
    if (!auth.success) {
        return res.status(auth.code).json({
            success: false,
            message: auth.message,
        });
    }
    try {
        const id = auth?.user?.id;
        const data = await prisma.users.findUnique({
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
        if (!validator.isEmail(body.email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak sesuai'
            });
        }

        const {nama, username, gambar, email} = body;
        const user_id = auth?.user?.id ?? '';
        const cek_data = await prisma.users.findUnique({
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
            await cloudinary.uploader.destroy(cek_data.gambar);
        }
        const update = await prisma.users.update({
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
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error
        });
    }
}