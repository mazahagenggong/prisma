import {Password, Profile} from "../../controllers/user.controller";

const path:string = "/user";
const User = (app: any) => {
    app.put(`${path}/password`, Password);
    app.put(`${path}/profile`, Profile);
}

export default User;