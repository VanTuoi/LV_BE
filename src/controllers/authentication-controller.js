
// In the Project
import db from "../models/index";
import auth from '../middleware/authentication'
import createResponse from '../helpers/responseHelper';
import authenticationServices from '../services/authentication-services'

const register = async (req, res) => {
    const { U_Name: name, U_Email: email, U_PhoneNumber: phone, U_Password: password } = req.body;

    try {
        if (!name || !email || !phone || !password) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }

        const isPhoneExist = await authenticationServices.findPhone(phone);

        if (isPhoneExist) {
            return res.status(200).json(createResponse(2, 'Số điện thoại đã được đăng kí'));
        } else {
            const record = await authenticationServices.createUser(name, email, phone, password, 'M', null, 0);

            if (!record) {
                return res.status(200).json(createResponse(1, 'Tạo tài khoản thất bại'));
            }
            return res.status(200).json(createResponse(0, 'Tạo tài khoản thành công', true));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};

const login = async (req, res) => {
    const { U_PhoneNumber: phone, U_Password: password } = req.body;

    try {
        if (!phone || !password) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập số điện thoại và mật khẩu'));
        }

        const isPhoneExist = await authenticationServices.findPhone(phone);

        if (!isPhoneExist) {
            return res.status(200).json(createResponse(1, 'Số điện thoại không tồn tại trong hệ thống'));
        } else {
            let account = await authenticationServices.findPasswordOfUserByPhone(phone);

            if (!account) {
                return res.status(200).json(createResponse(3, 'Không thể tìm tài khoản'));
            }
            const isPasswordCorrect = await authenticationServices.comparePassword(password, account.U_Password);

            if (!isPasswordCorrect) {
                return res.status(200).json(createResponse(2, 'Mật khẩu không chính xác'));
            }
            account = await authenticationServices.findUserByPhone(phone)
            const jwtToken = await auth.createJWT(account.U_Id);
            res.cookie("Jwt", jwtToken, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 })
            return res.status(200).json(createResponse(0, 'Đăng nhập thành công', { account }));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};

export default login;


module.exports = {
    register, login,
}
