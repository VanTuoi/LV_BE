import express from "express";
const { scheduleBooking, listHoliday, createAHoliday, checkIn, createTheCoffeeStore, checkManagerHaveStore, updateTheCoffeeStore, createTheMenuCoffeeStore } = require('../controllers/manager-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initManagerRoutes() {
    let router = express.Router();
    router.get('/booking-schedule', scheduleBooking);
    router.get('/holiday', listHoliday);
    router.post('/holiday', createAHoliday);
    router.post('/check-in', checkIn);

    // Store
    router.post('/store-check', checkManagerHaveStore);
    router.post('/store', createTheCoffeeStore);
    router.patch('/store', updateTheCoffeeStore);
    router.post('/store', createTheMenuCoffeeStore);

    return router;
}
export default initManagerRoutes