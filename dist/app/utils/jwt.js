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
exports.authenticateToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const authenticateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return {
            success: false,
            code: 401,
            message: 'Token tidak ada',
        };
    }
    try {
        const cek_token = jsonwebtoken_1.default.verify(token, (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : '');
        if (!cek_token.id) {
            return {
                success: false,
                code: 403,
                message: 'Token tidak valid'
            };
        }
        const id_user = cek_token.id;
        const user = yield prisma.users.findUnique({
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
            user: user
        };
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            code: 403,
            message: 'Token tidak valid',
            error: error
        };
    }
});
exports.authenticateToken = authenticateToken;
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
//# sourceMappingURL=jwt.js.map