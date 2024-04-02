import express from "express";
import {
    loginUser,
    loginManager,
    registerUser,
    registerManager,
    logOut,
    forgotPasswordUser,
    changePasswordUser
} from '../controllers/authentication-controller';


function initAuthRoutes() {
    let router = express.Router();
    router.post('/change-password', changePasswordUser)
    router.post('/forgot-password', forgotPasswordUser)
    router.post('/login-u', loginUser);
    router.post('/login-m', loginManager);
    router.post('/register-u', registerUser);
    router.post('/register-m', registerManager);
    router.get('/logout', logOut)
    return router;
}
export default initAuthRoutes;