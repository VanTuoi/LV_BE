import express from "express";
import {
    getCoffeeStorebyId,
    getDetailCoffeeStorebyId,
    getMenusCoffeeStorebyId,
    getServicesCoffeeStorebyId,
    getTagsCoffeeStorebyId,
    getHolidaysStore,
    getCommentStore,
    getRatingStore,
    getStoresByName,
    checkTimeBooking,
    getBannerStore,
    createReserveTicketNoAccount,
} from '../controllers/store-controller';

function initStoreRouters() {
    let router = express.Router();

    router.get('/search', getStoresByName);
    router.get('/detail', getDetailCoffeeStorebyId);
    router.get('/holidays', getHolidaysStore);
    router.get('/menus', getMenusCoffeeStorebyId);
    router.get('/services', getServicesCoffeeStorebyId);
    router.get('/comments', getCommentStore);
    router.post('/check-time-booking', checkTimeBooking)                // Có ip
    router.post('/create-reserver', createReserveTicketNoAccount)        // Có ip
    router.get('/rating', getRatingStore);
    router.get('/image-banner', getBannerStore);
    router.get('/tags', getTagsCoffeeStorebyId);
    router.get('/:id', getCoffeeStorebyId);

    return router;
}
export default initStoreRouters