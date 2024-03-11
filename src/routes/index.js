// Third library
import express from "express";

// In the project
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
    app.get('/*', (req, res) => {
        return res.status(200).json({
            errorCode: '-6',
            errorMessage: 'Không tìm thấy url trong backend',
            data: null
        });
    });
}

module.exports = initWebRoutes;