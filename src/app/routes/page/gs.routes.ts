import {FindAll, FindOne, EditOne, DeleteOne, CreateOne, Backup, Reset} from "../../controllers/gs.controller";

const path:string = "/gs";
const GS = (app: any) => {
    app.post(`${path}/`, FindAll);
    app.get(`${path}/(:id)`, FindOne);
    app.post(`${path}/edit/(:id)`, EditOne);
    app.delete(`${path}/(:id)`, DeleteOne);
    app.post(`${path}/tambah`, CreateOne);
    app.post(`${path}/backup`, Backup);
    app.post(`${path}/reset`, Reset);
}

export default GS;
