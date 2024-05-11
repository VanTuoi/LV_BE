import express from "express";
import {
    loginUser,
    loginUserWithGoogle,
    loginManager,
    registerUser,
    registerManager,
    logOut,
    forgotPasswordUser,
    changePasswordUser
} from '../controllers/authentication-controller';


function initAuthRoutes() {
    let router = express.Router();
    router.get('/logout', logOut)
    router.post('/login-user-google', loginUserWithGoogle);
    router.post('/login-user', loginUser);
    router.post('/login-manager', loginManager);
    router.post('/register-user', registerUser);
    router.post('/register-manager', registerManager);
    router.post('/change-password', changePasswordUser)
    router.post('/forgot-password', forgotPasswordUser)
    return router;
}
export default initAuthRoutes;