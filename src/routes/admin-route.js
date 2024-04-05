import express from "express";
import {
    login,
    getAllUsers,
    lockUser,
    unlockUser,
    deleteUser,
    getAllManagers,
    lockManager,
    unlockManager,
    deleteManager,

    getAllStores,
    lockStore,
    unlockStore,
    deleteStore,

    getAllReports,
    changeStatusReport,
    deleteReport,
} from '../controllers/admin-controller';

function initAdminRoutes() {
    let router = express.Router();

    router.post('/login', login);

    router.post('/get-all-users', getAllUsers);
    router.post('/lock-user', lockUser);
    router.post('/un-lock-user', unlockUser);
    router.post('/delete-user', deleteUser);

    router.post('/get-all-managers', getAllManagers);
    router.post('/lock-manager', lockManager);
    router.post('/un-lock-manager', unlockManager);
    router.post('/delete-manager', deleteManager);

    router.post('/get-all-stores', getAllStores);
    router.post('/lock-store', lockStore);
    router.post('/un-lock-store', unlockStore);
    router.post('/delete-store', deleteStore);

    router.post('/get-all-reports', getAllReports);
    router.post('/change-status-report', changeStatusReport);
    router.post('/delete-report', deleteReport);

    return router;
}
export default initAdminRoutes;