import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const authenticateToken = async (req:any, res:any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return {
            success: false,
            code: 401,
            message: 'Token tidak ada',
        };
    }
    try {
        const cek_token: any = jwt.verify(token, process.env.JWT_SECRET ?? '');
        if (!cek_token.id) {
            return {
                success: false,
                code: 403,
                message: 'Token tidak valid'
            };
        }
        const id_user = cek_token.id;
        const user = await prisma.users.findUnique({
            where: { id: id_user },
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
            return {
                success: false,
                code: 404,
                message: 'User tidak ditemukan'
            };
        }
        return {
            success: true,
            code: 200,
            user:user
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            code: 403,
            message: 'Token tidak valid',
            error: error
        };
    }
};

// const adminToken = async (req:any, res:any, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//
//     if (!token) {
//         return {
//             success: false,
//             code: 401,
//             message: 'Token tidak ada'
//         };
//     }
//
//
//     try {
//         req.user = jwt.verify(token, process.env.JWT_SECRET);
//         const id_user = req.user.id;
//         const data_user = await dbuser.findById(id_user).select('-password');
//         if (!data_user) {
//             return {
//                 success: false,
//                 code: 404,
//                 message: 'User tidak ditemukan'
//             };
//         }
//         if (data_user.role !== 'admin') {
//             return {
//                 success: false,
//                 code: 404,
//                 message: 'Anda bukan admin'
//             };
//         }
//         return {
//             success: true,
//             code: 200,
//             message: 'Token valid',
//             user: data_user
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             success: false,
//             code: 403,
//             message: 'Token tidak valid',
//             error: error
//         };
//     }
// };
//
// const mediaToken = async (req:any, res:any, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//
//     if (!token) {
//         return {
//             success: false,
//             code: 401,
//             message: 'Token tidak ada'
//         };
//     }
//
//
//     try {
//         req.user = jwt.verify(token, process.env.JWT_SECRET);
//         const id_user = req.user.id;
//         const data_user = await dbuser.findById(id_user).select('-password');
//         if (!data_user) {
//             return {
//                 success: false,
//                 code: 404,
//                 message: 'User tidak ditemukan'
//             };
//         }
//         if (data_user.role !== 'admin' && data_user.role !== 'media') {
//             return {
//                 success: false,
//                 code: 404,
//                 message: 'Anda bukan admin'
//             };
//         }
//         return {
//             success: true,
//             code: 200,
//             message: 'Token valid',
//             user: data_user
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             success: false,
//             code: 403,
//             message: 'Token tidak valid',
//             error: error
//         };
//     }
// };