import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {Request, Response} from 'express';
import Auth from "./app/routes/page/auth.routes";
import Post from "./app/routes/page/post.routes";
import GS from "./app/routes/page/gs.routes";
import Slug from "./app/routes/page/slug.routes";
import Kategori from "./app/routes/page/kategori.routes";
import User from "./app/routes/page/user.routes";

const app = express();
const PORT = 3000

const allowed = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://mazainulhasan1.sch.id',
    'https://www.mazainulhasan1.sch.id',
    'https://web-ma-nextjs.vercel.app',
];
const corsOptions = {
    origin: allowed,
}

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", (req: Request, res: Response) => {
    res.json({message: "cari apa bre?"});
});

Auth(app);
GS(app);
Post(app);
Slug(app);
Kategori(app);
User(app);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});