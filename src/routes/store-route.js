import express from "express";
const { getTheCoffeeStorebyId, getDetailTheCoffeeStorebyId, getMenusTheCoffeeStorebyId,
    getServicesTheCoffeeStorebyId, getTagsTheCoffeeStorebyId,
} = require('../controllers/store-controller');

const { createCoffeeStore, getCoffeeStoreByIdManager, updateCoffeeStore
} = require('../controllers/store-controller');

function initStoreRouters() {
    let router = express.Router();

    router.get('/detail', getDetailTheCoffeeStorebyId);
    router.get('/menus', getMenusTheCoffeeStorebyId);
    router.get('/services', getServicesTheCoffeeStorebyId);
    router.get('/tags', getTagsTheCoffeeStorebyId);

    router.get('/:id', getTheCoffeeStorebyId);

    // Manager store
    router.post('/m-store', createCoffeeStore);
    router.patch('/m-store', updateCoffeeStore);
    router.post('/m-store-full', getCoffeeStoreByIdManager);

    return router;
}
export default initStoreRouters