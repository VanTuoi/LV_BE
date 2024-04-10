import adminServices from '../services/admin-services'
import createResponse from '../helpers/responseHelper';

//--------------------------------------------------- Account--------------------------//
const login = async (req, res) => {
    const { A_UserName: userName, A_Password: password } = req.body;

    if (!userName || !password) {
        return res.status(200).json(createResponse(-1, 'Không đủ dữ liệu đăng nhập', null));
    }

    try {
        if (userName !== 'admin') {
            return res.status(200).json(createResponse(1, 'Không tìm thấy tên đăng nhập', null));
        }

        if (password !== 'admin') {
            return res.status(200).json(createResponse(2, 'Mật khẩu không chính xác', null));
        }

        return res.status(200).json(createResponse(0, 'Đăng nhập thành công', 'Admin'));

    } catch (error) {
        console.error('Lỗi khi đăng nhập admin', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi đăng nhập admin', null));
    }
}

//----------------------------------------------------User------------------------------//
const getAllUsers = async (req, res) => {

    try {

        let users = await adminServices.findAllUsers()

        if (!users) {
            return res.status(200).json(createResponse(1, 'Không tìm thấy người dùng nào', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy danh sách người dùng', users));

    } catch (error) {
        console.error('Lỗi khi tìm danh sách người dùng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi tìm danh sách người dùng'));
    }
}

const lockUser = async (req, res) => {
    const { U_Id } = req.body;

    if (!U_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản cần khóa', null));

    try {

        let status = await adminServices.lockUser(U_Id)

        if (!status) {
            return res.status(200).json(createResponse(2, 'Khóa tài khoản không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Khóa tài khoản thành công',));

    } catch (error) {
        console.error('Lỗi khi khóa tài khoản người dùng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi khóa tài khoản người dùng', null));
    }

}

const unlockUser = async (req, res) => {
    const { U_Id } = req.body;

    if (!U_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản cần mở khóa', null));

    try {

        let status = await adminServices.unlockUser(U_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Mở Khóa tài khoản không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Mở Khóa tài khoản thành công',));

    } catch (error) {
        console.error('Lỗi khi mở khóa tài khoản người dùng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi mở khóa tài khoản người dùng', null));
    }

}

const deleteUser = async (req, res) => {
    const { U_Id } = req.body;

    if (!U_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản cần xóa', null));

    try {

        let status = await adminServices.deleteUser(U_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Xóa tài khoản không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Xóa tài khoản thành công',));

    } catch (error) {
        console.error('Lỗi khi xóa tài khoản người dùng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khixóa tài khoản người dùng', null));
    }

}
//----------------------------------------------------Manager------------------------------//

const getAllManagers = async (req, res) => {

    try {

        let users = await adminServices.findAllManagers()

        if (!users) {
            return res.status(200).json(createResponse(1, 'Không tìm thấy người quản lý nào', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy danh sách người quản lý', users));

    } catch (error) {
        console.error('Lỗi khi tìm danh sách người quản lý', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi tìm danh sách người quản lý'));
    }
}

const lockManager = async (req, res) => {
    const { M_Id } = req.body;

    if (!M_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản quản lý cần khóa', null));

    try {

        let status = await adminServices.lockManager(M_Id)

        if (!status) {
            return res.status(200).json(createResponse(2, 'Khóa tài khoản quản lý không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Khóa tài khoản quản lý thành công',));

    } catch (error) {
        console.error('Lỗi khi khóa tài khoản người quản lý', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi khóa tài khoản người quản lý', null));
    }

}

const unlockManager = async (req, res) => {
    const { M_Id } = req.body;

    if (!M_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản quản lý cần mở khóa', null));

    try {

        let status = await adminServices.unlockManager(M_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Mở Khóa tài khoản quản lý không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Mở Khóa tài khoản quản lý thành công',));

    } catch (error) {
        console.error('Lỗi khi mở khóa tài khoản người quản lý', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi mở khóa tài khoản người quản lý', null));
    }

}

const deleteManager = async (req, res) => {
    const { M_Id } = req.body;

    if (!M_Id) return res.status(200).json(createResponse(-1, 'Không có Id tài khoản quản lý cần xóa', null));

    try {

        let status = await adminServices.deleteManager(M_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Xóa tài khoản quản lý không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Xóa tài khoản quản lý thành công',));

    } catch (error) {
        console.error('Lỗi khi xóa tài khoản người quản lý', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi xóa tài khoản người quản lý', null));
    }

}

//------------------------------------------------store---------------------------------------//
const getAllStores = async (req, res) => {

    try {

        let stores = await adminServices.findAllStores()

        if (!stores) {
            return res.status(200).json(createResponse(1, 'Không tìm thấy cửa hàng nào', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy danh sách cửa hàng', stores));

    } catch (error) {
        console.error('Lỗi khi tìm danh sách cửa hàng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi tìm danh sách cửa hàng'));
    }
}

const lockStore = async (req, res) => {
    const { CS_Id } = req.body;

    if (!CS_Id) return res.status(200).json(createResponse(-1, 'Không có Id cửa hàng cần khóa', null));

    try {

        let status = await adminServices.lockStore(CS_Id)

        if (!status) {
            return res.status(200).json(createResponse(2, 'Khóa cửa hàngkhông thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Khóa tài cửa hàng thành công',));

    } catch (error) {
        console.error('Lỗi khi khóa cửa hàng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi khóa cửa hàng', null));
    }

}

const unlockStore = async (req, res) => {
    const { CS_Id } = req.body;

    if (!CS_Id) return res.status(200).json(createResponse(-1, 'Không có Id cửa hàng cần mở khóa', null));

    try {

        let status = await adminServices.unlocStore(CS_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Mở Khóa tcửa hàng không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Mở Khóa cửa hàng thành công',));

    } catch (error) {
        console.error('Lỗi khi mở khóa cửa hàng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi mở khóa cửa hàng', null));
    }

}

const deleteStore = async (req, res) => {
    const { CS_Id } = req.body;
    if (!CS_Id) return res.status(200).json(createResponse(-1, 'Không có Id cửa hàng cần xóa', null));

    try {

        let status = await adminServices.deleteStore(CS_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Xóa cửa hàng không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Xóa cửa hàng thành công',));

    } catch (error) {
        console.error('Lỗi khi xóa cửa hàng', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi xóa cửa hàng', null));
    }

}

//----------------------------------------------------Report------------------------------//

const getAllReports = async (req, res) => {

    try {

        let reports = await adminServices.findAllReports()

        if (!reports) {
            return res.status(200).json(createResponse(1, 'Không tìm báo cáo nào', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy danh sách báo cáo', reports));

    } catch (error) {
        console.error('Lỗi khi tìm danh sách báo cáo', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi tìm danh sách báo cáo'));
    }
}

const changeStatusReport = async (req, res) => {
    const { R_Id, R_Feedback } = req.body;

    if (!R_Id) return res.status(200).json(createResponse(-1, 'Không đủ dữ liệu thay đổi báo cáo', null));

    try {

        let status = await adminServices.changeStatusReport(R_Id, R_Feedback)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Thay đổi báo cáo không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Thay đổi báo cáo thành công',));

    } catch (error) {
        console.error('Lỗi khi Thay đổi báo cáo', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi thay đổi báo cáo', null));
    }

}

const deleteReport = async (req, res) => {
    const { R_Id } = req.body;
    if (!R_Id) return res.status(200).json(createResponse(-1, 'Không có Id báo cáo cần xóa', null));

    try {

        let status = await adminServices.deleteReport(R_Id)
        if (!status) {
            return res.status(200).json(createResponse(2, 'Xóa báo cáo không thành công', null));
        }
        return res.status(200).json(createResponse(0, 'Xóa báo cáo thành công',));

    } catch (error) {
        console.error('Lỗi khi xóa báo cáo', error);
        return res.status(200).json(createResponse(-5, 'Lỗi khi xóa báo cáo', null));
    }

}


module.exports = {
    // Account
    login,
    //User
    getAllUsers,
    lockUser,
    unlockUser,
    deleteUser,
    //Manager
    getAllManagers,
    lockManager,
    unlockManager,
    deleteManager,
    //Store
    getAllStores,
    lockStore,
    unlockStore,
    deleteStore,
    //Report
    getAllReports,
    changeStatusReport,
    deleteReport
}