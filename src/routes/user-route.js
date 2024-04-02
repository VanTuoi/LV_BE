import express from "express";
import { verifyTokenUser } from '../middleware/authentication'
import {
    getInfor,
    updateInfor,
    changePassword,
    checkTimeBooking,
    getReserveTicketsToday,
    getAllReserveTickets,
    createReserveTicket,
    statusFavouriteStore,
    createFavouriteStore,
    statusFavouriteAllStores,
    deleteFavouriteStore
} from '../controllers/user-controller';

function initUserRoutes() {
    let router = express.Router();

    router.all('/*', verifyTokenUser)
    // Account
    router.post('/infor', getInfor)
    router.post('/update-infor', updateInfor)
    router.post('/change-password', changePassword)

    // Store
    router.post('/check-time-a-booking', checkTimeBooking);
    router.post('/all-reserver-ticket-today', getReserveTicketsToday);
    router.post('/all-reserver-ticket', getAllReserveTickets);
    router.post('/favourite-store', createFavouriteStore);
    router.post('/delete-favourite-store', deleteFavouriteStore);
    router.post('/status-favourite-store', statusFavouriteStore);
    router.post('/status-favourite-all-store', statusFavouriteAllStores);
    router.post('/create-reserver', createReserveTicket);

    return router;
}
export default initUserRoutes;