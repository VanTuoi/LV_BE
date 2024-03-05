import express from "express";
const { createABooking, checkTimeABooking, testAPI } = require('../controllers/user-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initUserRoutes() {
    let router = express.Router();
    router.post('/create-a-booking', createABooking);
    router.post('/check-time-a-booking', checkTimeABooking);
    router.post('/test', testAPI);
    return router;
}
export default initUserRoutes;