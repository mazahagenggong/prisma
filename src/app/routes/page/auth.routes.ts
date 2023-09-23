import {SignIn, Detail} from "../../controllers/auth.controller";

const path:string = "/auth";
const Auth = (app: any) => {
    app.post(`${path}/signin`, SignIn);
    app.post(`${path}/detail`, Detail);
}

export default Auth;
