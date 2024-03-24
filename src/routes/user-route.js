import express from "express";
import { verifyTokenUser } from '../middleware/authentication'
const { createABooking, checkTimeABooking, getInforUser, updateInfo, testAPI } = require('../controllers/user-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initUserRoutes() {
    let router = express.Router();

    router.all('/*', verifyTokenUser)
    router.post('/create-a-booking', createABooking);
    router.post('/check-time-a-booking', checkTimeABooking);
    router.post('/info', getInforUser)
    router.post('/update-info', updateInfo)
    router.post('/test', testAPI);
    return router;
}
export default initUserRoutes;