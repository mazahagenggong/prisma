import dotenv from "dotenv";
dotenv.config();
import {v2 as cloudinary} from "cloudinary";

const cloud_name = process.env.CD_NAME ?? '';
const api_key = process.env.CD_API_KEY ?? '';
const api_secret = process.env.CD_SECRET ?? '';

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});

export default cloudinary;