import jwt from 'jsonwebtoken';
import db from "../models/index";
import createResponse from '../helpers/responseHelper';


const createJWTDefault = (id) => {
    const payload = { data: { Id: id } };
    const key = process.env.JWT_SECRET;

    try {
        const token = jwt.sign(payload, key, { expiresIn: '2h' });
        return token;
    } catch (error) {
        console.error('Error generating JWT user', error);
        return null
    }
};

const createJWTChangePassword = (id) => {
    const payload = { data: { U_Id: id } };
    const key = process.env.JWT_SECRET;

    try {
        const token = jwt.sign(payload, key, { expiresIn: '5m' });
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error);
        return null
    }
};

const verifyTokenUser = async (req, res, next) => {
    try {

        const key = process.env.JWT_SECRET;
        const token = req.cookies.Jwt;

        // Kiểm tra xem token có đúng định dạng không
        const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;

        if (!token || !tokenRegex.test(token)) {
            res.cookie("Jwt", '', { maxAge: 2 }) // Xóa token
            return res.status(201).json(createResponse(-1, 'Token không hợp lệ hoặc không tồn tại', null));
        }

        const decodedToken = jwt.verify(token, key);

        if (!decodedToken || !decodedToken.exp) {
            return res.status(200).json(createResponse(-2, 'Token không chứa thông tin hết hạn', null));
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);         // Hết hạn trong 2h
        if (currentTimeInSeconds > decodedToken.exp) {
            return res.status(200).json(createResponse(-3, 'Token đã hết hạn', null));
        }

        const user = await db.User.findOne({ where: { U_Id: decodedToken.data.Id } });

        const status = await db.Status_User.findOne({
            where: { U_Id: decodedToken.data.Id },
            order: [['createdAt', 'DESC']],
        });
        if (status && status.SU_Describe === 'Lock') {
            res.cookie("Jwt", '', { maxAge: 2 })        // Xóa token
            return res.status(200).json(createResponse(-6, 'Tài khoản của bạn đã bị khóa', null));
        }

        if (!user) {
            return res.status(200).json(createResponse(-4, 'Bạn không có quyền truy cập chức năng này', null));
        }

        req.body.U_Id = decodedToken.data.Id;
        next();
    } catch (error) {
        // Xử lý lỗi một cách an toàn 
        console.error('Lỗi khi xác minh mã JWT:', error);
        res.cookie("Jwt", '', { maxAge: 2 })        // Xóa token
        return res.status(200).json(createResponse(-3, 'Token không hợp lệ', null));
    }
};

const verifyTokenManager = async (req, res, next) => {
    const key = process.env.JWT_SECRET;
    const token = req.cookies.Jwt;

    if (!token) {
        return res.status(201).json(createResponse(-1, 'Không tìm thấy token', null));
    }

    try {
        const decodedToken = jwt.verify(token, key);

        if (!decodedToken || !decodedToken.exp) {
            return res.status(200).json(createResponse(-2, 'Token không chứa thông tin hết hạn', null));
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);         // Hết hạn trong 2h
        if (currentTimeInSeconds > decodedToken.exp) {
            return res.status(200).json(createResponse(-3, 'Token đã hết hạn', null));
        }

        const manager = await db.Manager.findOne({ where: { M_Id: decodedToken.data.Id } });

        const status = await db.Status_Manager.findOne({
            where: { M_Id: decodedToken.data.Id },
            order: [['createdAt', 'DESC']],
        });
        if (status.SM_Describe === 'Lock') {
            res.cookie("Jwt", '', { maxAge: 2 })        // Xóa token
            return res.status(200).json(createResponse(-6, 'Tài khoản của bạn đã bị khóa', null));
        }

        if (!manager) {
            return res.status(200).json(createResponse(-4, 'Bạn không có quyền truy cập chức năng này', null));
        }

        req.body.M_Id = decodedToken.data.Id;
        next();

    } catch (error) {
        console.error('Error verifying JWT Manager:', error);
        return res.status(200).json(createResponse(-3, 'Token không hợp lệ', null));
    }
};

module.exports = {
    createJWTDefault,
    createJWTChangePassword,
    verifyTokenUser,
    verifyTokenManager
}