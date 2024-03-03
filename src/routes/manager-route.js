import express from "express";
const { scheduleBooking, listHoliday, createAHoliday } = require('../controllers/manager-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initManagerRoutes() {
    let router = express.Router();
    router.get('/booking-schedule', scheduleBooking);
    router.get('/holiday', listHoliday);
    router.post('/holiday', createAHoliday);
    return router;
}
export default initManagerRoutes