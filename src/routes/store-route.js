import express from "express";
import {
    getTopCoffeeStores,
    getAllCoffeeStores,
    getRandomCoffeeStores,
    getCoffeeStoreById,
    getDetailCoffeeStoreById,
    getMenusCoffeeStoreById,
    getServicesCoffeeStoreById,
    getHolidaysCoffeeStore,
    getCommentCoffeeStore,
    getRatingCoffeeStore,
    getCoffeeStoresByName,
    getBannerCofeeStore,

    getMaps,
    getNearCoffeeStore,

    checkTimeBooking,
    createReserveTicketNoAccount,
} from '../controllers/store-controller';

function initStoreRouters() {
    let router = express.Router();

    router.get('/get-top-store', getTopCoffeeStores);
    router.get('/get-random-store', getRandomCoffeeStores);
    router.get('/get-all-store', getAllCoffeeStores);
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

    router.post('/near-coffee-store', getNearCoffeeStore);
    router.post('/location-map', getMaps);


    router.get('/:id', getCoffeeStoreById);

    return router;
}
export default initStoreRouters