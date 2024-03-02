import express from "express";
const { CreateABooking, checkTimeABooking } = require('../controllers/UserController');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initUserRoutes() {
    let router = express.Router();
    router.post('/create-a-booking', CreateABooking);
    router.post('/ckeck-time-a-booking', checkTimeABooking);
    return router;
}
export default initUserRoutes;