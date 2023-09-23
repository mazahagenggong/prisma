import {editOne, createOne} from "../../controllers/slug.controller";

const path:string = "/slug";
const Slug = (app: any) => {
    app.post(`${path}/`, createOne);
    app.post(`${path}/edit`, editOne);
}

export default Slug;