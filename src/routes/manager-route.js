import express from "express";
const { scheduleBooking, listHoliday, createAHoliday, checkIn } = require('../controllers/manager-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initManagerRoutes() {
    let router = express.Router();
    router.post('/booking-schedule', scheduleBooking);
    router.get('/holiday', listHoliday);
    router.post('/holiday', createAHoliday);
    router.post('/check-in', checkIn);

    return router;
}
export default initManagerRoutes