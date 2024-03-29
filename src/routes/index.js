// Third library
import express from "express";

// In the project
import createResponse from '../helpers/responseHelper';
import initAuthRoutes from './auth-route';
import initUserRoutes from './user-route';
import initManagerRoutes from './manager-route';
import initAdminRoutes from './admin-route';
import initStoreRouters from './store-route';

let initWebRoutes = (app) => {
    // Sử dụng các hàm initWebRoutes đã tạo
    app.use('/api/v1/auth', initAuthRoutes());
    app.use('/api/v1/user', initUserRoutes());
    app.use('/api/v1/manager', initManagerRoutes());
    app.use('/api/v1/admin', initAdminRoutes());
    app.use('/api/v1/store', initStoreRouters());

    // Route chung
    app.all('/*', (req, res) => {
        return res.status(200).json(createResponse(-1, 'Không tìm thấy url'));
    });
}

module.exports = initWebRoutes;