import express from "express";
import {
    getTopCoffeeStores,
    getCoffeeStoreById,
    getDetailCoffeeStoreById,
    getMenusCoffeeStoreById,
    getServicesCoffeeStoreById,
    getTagsCoffeeStoreById,
    getHolidaysCoffeeStore,
    getCommentCoffeeStore,
    getRatingCoffeeStore,
    getCoffeeStoresByName,
    checkTimeBooking,
    getBannerCofeeStore,
    createReserveTicketNoAccount,
} from '../controllers/store-controller';

function initStoreRouters() {
    let router = express.Router();


    router.get('/get-top-store', getTopCoffeeStores);
    router.get('/search', getCoffeeStoresByName);
    router.get('/detail', getDetailCoffeeStoreById);
    router.get('/holidays', getHolidaysCoffeeStore);
    router.get('/menus', getMenusCoffeeStoreById);
    router.get('/services', getServicesCoffeeStoreById);
    router.get('/comments', getCommentCoffeeStore);
    router.post('/check-time-booking', checkTimeBooking)                // Có ip
    router.post('/create-reserver', createReserveTicketNoAccount)        // Có ip
    router.get('/rating', getRatingCoffeeStore);
    router.get('/image-banner', getBannerCofeeStore);
    router.get('/tags', getTagsCoffeeStoreById);
    router.get('/:id', getCoffeeStoreById);

    return router;
}
export default initStoreRouters