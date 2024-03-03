import express from "express";
const { login, register } = require('../controllers/authentication-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initAuthRoutes() {
    let router = express.Router();
    router.post('/login', login);
    router.post('/register', register);
    return router;
}
export default initAuthRoutes;