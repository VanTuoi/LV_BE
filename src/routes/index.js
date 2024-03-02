// Third library
import express from "express";

// In the project
import initAuthRoutes from './AuthRoute';
import initUserRoutes from './UserRoute';
import initManagerRoutes from './ManagerRoute';
import initAdminRoutes from './AdminRoute';

let initWebRoutes = (app) => {
    // Sử dụng các hàm initWebRoutes đã tạo
    app.use('/api/v1/auth', initAuthRoutes());
    app.use('/api/v1/user', initUserRoutes());
    app.use('/api/v1/manager', initManagerRoutes());
    app.use('/api/v1/admin', initAdminRoutes());

    // Route chung
    app.get('/*', (req, res) => {
        return res.status(200).json({
            errorCode: '-6',
            errorMessage: 'Không tìm thấy',
            data: null
        });
    });
}

module.exports = initWebRoutes;