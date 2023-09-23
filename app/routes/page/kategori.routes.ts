import {createOne, deleteOne, editOne, findAll, findOne, WDFindAll} from "../../controllers/kategori.controller";

const path:string = "/kategori";
const Kategori = (app: any) => {
    app.post(`${path}/`, findAll);
    app.get(`${path}/semua`, WDFindAll);
    app.get(`${path}/(:id)`, findOne);
    app.put(`${path}/(:id)`, editOne);
    app.post(`${path}/tambah`, createOne);
    app.delete(`${path}/(:id)`, deleteOne);
}

export default Kategori;