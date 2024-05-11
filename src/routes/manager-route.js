import express from "express";
import { verifyTokenManager } from '../middleware/authentication'

import {
    getInfor,
    updateInfor,
    changePassword,

    isManagerAssignedToStore,
    checkIn,
    historyCheckIn,
    checkStatusAllReserveTicketOfStore,
    getHolidays,
    getImageBanner,
    getReserveTicketsToDay,
    getReserveTicketsToMonth,
    getCoffeeStoreByIdManager,
    updateCoffeeStore,
    createCoffeeStore,
    createHoLidayOfCoffeeStore,
    deleteHolidayOfCoffeeStore,
    uploadImgaePageDetail,
    deleteImageBanner,

    createLocationMaps,
    getLocationMaps,

    overViewBookingWithDay,
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
    router.post('/create-holiday', createHoLidayOfCoffeeStore);
    router.post('/delete-holiday', deleteHolidayOfCoffeeStore);
    router.post('/get-holiday', getHolidays);
    router.post('/get-reserve-tickets-to-day', getReserveTicketsToDay);
    router.post('/get-reserve-tickets', getReserveTicketsToMonth);
    router.post('/check-status-all-reserve-of-store', checkStatusAllReserveTicketOfStore)
    router.post('/create-store', createCoffeeStore);
    router.patch('/update-store', updateCoffeeStore);
    router.post('/check-in', checkIn);
    router.post('/history-check-in', historyCheckIn);
    router.post('/upload-image-page-detail', uploadImgaePageDetail);
    router.post('/upload-image-banner', uploadImgaePageDetail);
    router.post('/get-images-banner', getImageBanner);
    router.delete('/delete-images-banner', deleteImageBanner);

    router.patch('/location', createLocationMaps);
    router.get('/location', getLocationMaps);

    // Overview
    router.post('/get-over-view-booking-by-day', overViewBookingWithDay);


    return router;
}
export default initManagerRoutes