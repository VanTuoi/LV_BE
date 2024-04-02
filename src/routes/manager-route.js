import express from "express";
import { verifyTokenManager } from '../middleware/authentication'

import {
    getInfor,
    updateInfor,
    changePassword,

    isManagerAssignedToStore,
    getCoffeeStoreByIdManager,
    createCoffeeStore,
    updateCoffeeStore,
    getReserveTicketsToMonth,
    getHolidays,
    createHoliday,
    deleteHoliday,
    checkIn,
    uploadImgaePageDetail,
    getImageBanner,
    deleteImageBanner,
} from '../controllers/manager-controller';


function initManagerRoutes() {
    let router = express.Router();

    router.all('/*', verifyTokenManager)

    // Account
    router.post('/infor', getInfor)
    router.post('/update-infor', updateInfor)
    router.post('/change-password', changePassword)

    // Store
    router.post('/is-manager-store', isManagerAssignedToStore);
    router.post('/get-full-store', getCoffeeStoreByIdManager);
    router.get('/get-holiday', getHolidays);
    router.post('/get-reserve-tickets', getReserveTicketsToMonth);
    router.post('/create-store', createCoffeeStore);
    router.patch('/update-store', updateCoffeeStore);
    router.post('/create-holiday', createHoliday);
    router.post('/check-in', checkIn);
    router.post('/upload-image-page-detail', uploadImgaePageDetail);
    router.post('/upload-image-banner', uploadImgaePageDetail);
    router.post('/get-images-banner', getImageBanner);
    router.delete('/delete-images-banner', deleteImageBanner);



    return router;
}
export default initManagerRoutes