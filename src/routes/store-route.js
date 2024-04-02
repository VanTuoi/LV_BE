import express from "express";
import {
    getCoffeeStorebyId,
    getDetailCoffeeStorebyId,
    getMenusCoffeeStorebyId,
    getServicesCoffeeStorebyId,
    getTagsCoffeeStorebyId,
    getStoresByName
} from '../controllers/store-controller';

function initStoreRouters() {
    let router = express.Router();

    router.get('/search', getStoresByName);
    router.get('/detail', getDetailCoffeeStorebyId);
    router.get('/menus', getMenusCoffeeStorebyId);
    router.get('/services', getServicesCoffeeStorebyId);
    router.get('/tags', getTagsCoffeeStorebyId);
    router.get('/:id', getCoffeeStorebyId);

    return router;
}
export default initStoreRouters