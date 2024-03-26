import express from "express";
import { verifyTokenUser } from '../middleware/authentication'
const {
    createABooking, checkTimeABooking, getInforUser, updateInfo,
    changePassword, saveStore, deleteStore, statusSaveAllStore, statusSaveStore, testAPI,
    getAllBooking,
} = require('../controllers/user-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initUserRoutes() {
    let router = express.Router();

    router.all('/*', verifyTokenUser)
    router.post('/save-store', saveStore);
    router.post('/all-booking', getAllBooking);
    router.post('/delete-store', deleteStore);
    router.post('/status-save-store', statusSaveStore);
    router.post('/status-save-all-store', statusSaveAllStore);
    router.post('/create-a-booking', createABooking);
    router.post('/check-time-a-booking', checkTimeABooking);
    router.post('/info', getInforUser)
    router.post('/update-info', updateInfo)
    router.post('/change-password', changePassword)
    router.post('/test', testAPI);
    return router;
}
export default initUserRoutes;