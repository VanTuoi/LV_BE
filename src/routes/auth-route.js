import express from "express";
const { loginUser, loginManager, registerUser, registerManager } = require('../controllers/authentication-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initAuthRoutes() {
    let router = express.Router();
    router.post('/login-u', loginUser);
    router.post('/login-m', loginManager);
    router.post('/register-u', registerUser);
    router.post('/register-m', registerManager);
    return router;
}
export default initAuthRoutes;