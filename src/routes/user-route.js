import express from "express";
import { verifyTokenUser } from '../middleware/authentication'
import {
    getInfor,
    updateInfor,
    changePassword,
    getAvatar,
    changeAvatar,

    checkTimeBooking,
    getReserveTicketsToday,
    getAllReserveTickets,
    createReserveTicketHaveAccount,
    statusFavouriteStore,
    createFavouriteStore,
    statusFavouriteAllStores,
    deleteFavouriteStore,

    createComment,
    getComment,
    changeComment,
    deleteComment,

} from '../controllers/user-controller';

function initUserRoutes() {
    let router = express.Router();

    router.all('/*', verifyTokenUser)
    // Account
    router.post('/infor', getInfor)
    router.post('/update-infor', updateInfor)
    router.post('/change-password', changePassword)
    router.patch('/change-avatar', changeAvatar)
    router.post('/get-avatar', getAvatar)


    // Store
    router.post('/check-time-booking', checkTimeBooking);
    router.post('/all-reserver-ticket-today', getReserveTicketsToday);
    router.post('/all-reserver-ticket', getAllReserveTickets);
    router.post('/favourite-store', createFavouriteStore);
    router.post('/delete-favourite-store', deleteFavouriteStore);
    router.post('/status-favourite-store', statusFavouriteStore);
    router.post('/status-favourite-all-store', statusFavouriteAllStores);
    router.post('/create-reserver', createReserveTicketHaveAccount);

    router.post('/create-comment', createComment);
    router.post('/get-comment', getComment);
    router.post('/change-comment', changeComment);
    router.post('/delete-comment', deleteComment);

    return router;
}
export default initUserRoutes;