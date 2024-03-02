import express from "express";
const { ScheduleBooking, ListHoliday, CreateAHoliday } = require('../controllers/ManagerController');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initManagerRoutes() {
    let router = express.Router();
    router.get('/booking-schedule', ScheduleBooking);
    router.get('/holiday', ListHoliday);
    router.post('/holiday', CreateAHoliday);
    return router;
}
export default initManagerRoutes