
// In the Project
import db from "../models/index";
import auth from '../middleware/authentication'
import createResponse from '../helpers/responseHelper';
import authenticationServices from '../services/authentication-services'
import userServices from '../services/user-services'
import sendEmail from '../services/email-services'
import jwt from 'jsonwebtoken';

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
            // console.log('account', account);

            const isPasswordCorrect = await authenticationServices.comparePassword(password, account.U_Password);

            if (!isPasswordCorrect) {
                return res.status(200).json(createResponse(2, 'Mật khẩu không chính xác'));
            }
            account = await authenticationServices.findUserByPhone(phone)
            const jwtToken = await auth.createJWTDefault(account.U_Id);
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
            const jwtToken = await auth.createJWTDefault(fullManager.M_Id);
            // console.log('Cấp jwtToken m', jwtToken);
            res.cookie("Jwt", jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
            return res.status(200).json(createResponse(0, 'Đăng nhập thành công', account));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};
const logOut = async (req, res) => {
    res.clearCookie('Jwt');
    return res.status(200).json(createResponse(0, 'Đăng xuất thành công'));
}
const forgotPasswordUser = async (req, res) => {

    const { U_Email: email } = req.body;

    try {
        if (!email) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập email'));
        }

        const isEmailExist = await authenticationServices.findEmailUser(email);

        if (!isEmailExist) {
            return res.status(200).json(createResponse(1, 'Email không tồn tại trong hệ thống'));
        } else {


            let fullUser = await authenticationServices.findUserByEmail(email)
            let statusAccount = await authenticationServices.findLatestStatusByUserId(fullUser.U_Id)
            if (statusAccount === 'Lock') {
                return res.status(200).json(createResponse(4, 'Tài khoản của bạn đang bị khóa không thể đổi mật khẩu'));
            }
            const jwtToken = await auth.createJWTChangePassword(fullUser.U_Id);
            // sendEmail(`${account.U_Email}`, `${account.U_Name}`, `http://localhost:3000/authentication/change-password?Jwt=${jwtToken}`);
            return res.status(200).json(createResponse(0, 'Tạo url đổi mật khẩu thành công', `http://localhost:3000/authentication/change-password?Jwt=${jwtToken}`));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const changePasswordUser = async (req, res) => {
    const { Jwt: Jwt, U_Password: newPassword } = req.body;
    const key = process.env.JWT_SECRET;

    if (!Jwt || !newPassword) {
        return res.status(200).json(createResponse(-1, 'Không đủ dữ liệu', null));
    }

    try {
        const decoded = jwt.verify(Jwt, key);

        const user = await userServices.findUserById(decoded.data.U_Id)

        if (!user) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy tài khoản', null)); // Trả về status 403 và thông báo lỗi
        }
        userServices.changePasswordUser(user.U_Id, newPassword)
        return res.status(200).json(createResponse(0, 'Đăng xuất thành công'));
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return res.status(200).json(createResponse(-3, 'Token không hợp lệ vui lòng thử lại', null)); // Trả về status 401 và thông báo lỗi
    }

}




module.exports = {
    registerUser,
    registerManager,

    loginUser,
    loginManager,
    logOut,

    forgotPasswordUser,
    changePasswordUser
}
