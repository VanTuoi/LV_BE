
// In the Project
import db from "../models/index";
import auth from '../middleware/authentication'
import createResponse from '../helpers/responseHelper';
import authenticationServices from '../services/authentication-services'

const registerUser = async (req, res) => {
    const { U_Name: name, U_Email: email, U_PhoneNumber: phone, U_Password: password } = req.body;

    try {
        if (!name || !email || !phone || !password) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }

        const isPhoneExist = await authenticationServices.findPhoneUser(phone);

        if (isPhoneExist) {
            return res.status(200).json(createResponse(2, 'Số điện thoại đã được đăng kí'));
        } else {
            const record = await authenticationServices.createUser(name, email, phone, password, 'M', null, 0);

            if (!record) {
                return res.status(200).json(createResponse(1, 'Tạo tài khoản thất bại'));
            }

            let user = await authenticationServices.findUserByPhone(phone);
            await authenticationServices.createStatusUser(user.U_Id, 'Normal')
            return res.status(200).json(createResponse(0, 'Tạo tài khoản thành công', true));

        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};
const registerManager = async (req, res) => {
    const { M_Name: name, M_Email: email, M_PhoneNumber: phone, M_Password: password } = req.body;

    try {
        if (!name || !email || !phone || !password) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }

        const isPhoneExist = await authenticationServices.findPhoneManager(phone);

        if (isPhoneExist) {
            return res.status(200).json(createResponse(2, 'Số điện thoại đã được đăng kí'));
        } else {
            const record = await authenticationServices.createManager(name, email, phone, password, 'M', null,);

            if (!record) {
                return res.status(200).json(createResponse(1, 'Tạo tài khoản quản lý thất bại'));
            }

            let manager = await authenticationServices.findManagerByPhone(phone);
            await authenticationServices.createStatusManager(manager.M_Id, 'Normal')
            return res.status(200).json(createResponse(0, 'Tạo tài khoản quản lý thành công', true));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};
const loginUser = async (req, res) => {
    const { U_PhoneNumber: phone, U_Password: password } = req.body;

    try {
        if (!phone || !password) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập số điện thoại và mật khẩu'));
        }

        const isPhoneExist = await authenticationServices.findPhoneUser(phone);

        if (!isPhoneExist) {
            return res.status(200).json(createResponse(1, 'Số điện thoại không tồn tại trong hệ thống'));
        } else {
            let account = await authenticationServices.findPasswordOfUserByPhone(phone);

            if (!account) {
                return res.status(200).json(createResponse(3, 'Không thể tìm tài khoản'));
            }

            let fullUser = await authenticationServices.findUserByPhone(phone)
            let statusAccount = await authenticationServices.findLatestStatusByUserId(fullUser.U_Id)

            if (statusAccount === 'Lock') {
                return res.status(200).json(createResponse(4, 'Tài khoản của bạn đang bị khóa'));
            }
            console.log('account', account);

            const isPasswordCorrect = await authenticationServices.comparePassword(password, account.U_Password);

            if (!isPasswordCorrect) {
                return res.status(200).json(createResponse(2, 'Mật khẩu không chính xác'));
            }
            account = await authenticationServices.findUserByPhone(phone)
            const jwtToken = await auth.createJWT(account.U_Id);
            // console.log('Cấp jwtToken u', jwtToken);
            res.cookie("Jwt", jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
            return res.status(200).json(createResponse(0, 'Đăng nhập thành công', account));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};
const loginManager = async (req, res) => {
    const { M_PhoneNumber: phone, M_Password: password } = req.body;

    try {
        if (!phone || !password) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập số điện thoại và mật khẩu'));
        }

        const isPhoneExist = await authenticationServices.findPhoneManager(phone);

        if (!isPhoneExist) {
            return res.status(200).json(createResponse(1, 'Số điện thoại không tồn tại trong hệ thống'));
        } else {
            let account = await authenticationServices.findPasswordOfManagerByPhone(phone);


            if (!account) {
                return res.status(200).json(createResponse(3, 'Không thể tìm tài khoản'));
            }

            let fullManager = await authenticationServices.findManagerByPhone(phone)

            let statusAccount = await authenticationServices.findLatestStatusByManagerId(fullManager.M_Id)

            if (statusAccount === 'Lock') {
                return res.status(200).json(createResponse(4, 'Tài khoản của bạn đang bị khóa'));
            }

            const isPasswordCorrect = await authenticationServices.comparePassword(password, account.dataValues.M_Password);

            if (!isPasswordCorrect) {
                return res.status(200).json(createResponse(2, 'Mật khẩu không chính xác'));
            }
            account = await authenticationServices.findManagerByPhone(phone)
            const jwtToken = await auth.createJWT(fullManager.M_Id);
            // console.log('Cấp jwtToken m', jwtToken);
            res.cookie("Jwt", jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
            return res.status(200).json(createResponse(0, 'Đăng nhập thành công', account));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};

module.exports = {
    registerUser,
    registerManager,

    loginUser,
    loginManager,
}
