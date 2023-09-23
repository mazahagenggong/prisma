import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const SignIn = async (req: any, res: any) => {
    try {
        const {username, password, remember} = req.body;
        if (!username || !password) {
            return res
                .status(403)
                .json({message: "Username dan password harus diisi"});
        }
        const user = await prisma.users.findUnique({
            where: {username: username},
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        let expires;
        let kadaluarsa;
        if (remember) {
            expires = '7d';
            kadaluarsa = '7 hari';
        } else {
            expires = '1d';
            kadaluarsa = '1 hari';
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET ?? '', {
            expiresIn: expires,
        });
        let data = {
            id: user.id,
            nama: user.nama,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
            expires: kadaluarsa
        }
        return res.json({
            success: true,
            message: 'Berhasil login',
            data: data
        });
    } catch (error: any) {
        res.status(500).json({error: error});
    }
}

export const Detail = async (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ada'
        });
    }
    try {
        const cek_token: any = jwt.verify(token, process.env.JWT_SECRET ?? '');
        if (!cek_token.id) {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }
        const id_user = await cek_token.id ?? 'xxx';
        const user = await prisma.users.findUnique({
            where: {id: id_user},
            select: {
                id: true,
                username: true,
                email: true,
                nama: true,
                gambar: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
}