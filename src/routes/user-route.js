import express from "express";
import { verifyTokenUser } from '../middleware/authentication'
import {
    getInfor,
    updateInfor,
    changePassword,
    getAvatar,
    changeAvatar,
    getExp,

    checkTimeBooking,
    getReserveTicketsToday,
    checkStatusAllReserveTicketOfUser,
    getAllReserveTickets,
    createReserveTicketHaveAccount,
    statusFavouriteStore,
    createFavouriteStore,
    statusFavouriteAllStores,
    deleteFavouriteStore,

    createCommentOfUser,
    getComment,
    changeComment,
    deleteCommentOfUser,

    createReport,
    getReport,
    getAllReports,
    changeReport,
    deleteReport,

    payment,

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
    router.post('/get-exp', getExp)


    // Store
    router.post('/check-time-booking', checkTimeBooking);
    router.post('/all-reserver-ticket-today', getReserveTicketsToday);
    router.post('/all-reserver-ticket', getAllReserveTickets);
    router.post('/check-status-all-reserve-of-user', checkStatusAllReserveTicketOfUser)
    router.post('/favourite-store', createFavouriteStore);
    router.post('/delete-favourite-store', deleteFavouriteStore);
    router.post('/status-favourite-store', statusFavouriteStore);
    router.post('/status-favourite-all-store', statusFavouriteAllStores);
    router.post('/create-reserver', createReserveTicketHaveAccount);

    router.post('/get-comment', getComment);
    router.post('/create-comment', createCommentOfUser);
    router.post('/change-comment', changeComment);
    router.post('/delete-comment', deleteCommentOfUser);

    router.post('/get-report', getReport);
    router.post('/create-report', createReport);
    router.post('/get-all-reports', getAllReports);
    router.post('/change-report', changeReport);
    router.post('/delete-report', deleteReport);

    // payment
    router.post('/payment', payment);

    return router;
}
export default initUserRoutes;