import express from "express";
const { getDetailTheCoffeeStorebyId, getMenusTheCoffeeStorebyId, getTheCoffeeStorebyId } = require('../controllers/store-controller');

// Tạo các hàm initWebRoutes riêng cho từng nhóm route
function initStoreRouters() {
    let router = express.Router();

    router.get('/detail', getDetailTheCoffeeStorebyId);
    router.get('/menus', getMenusTheCoffeeStorebyId);
    router.get('/:id', getTheCoffeeStorebyId);

    return router;
}
export default initStoreRouters