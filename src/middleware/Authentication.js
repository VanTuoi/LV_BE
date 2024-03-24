import jwt from 'jsonwebtoken';
import db from "../models/index";
import createResponse from '../helpers/responseHelper';


const createJWTDefault = (id) => {
    const payload = { data: { U_Id: id } };
    const key = process.env.JWT_SECRET;

    try {
        const token = jwt.sign(payload, key, { expiresIn: '2h' });
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error);
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

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (currentTimeInSeconds > decodedToken.exp) {
            return res.status(200).json(createResponse(-3, 'Token đã hết hạn', null));
        }

        const user = await db.User.findOne({ where: { U_Id: decodedToken.data.U_Id } });

        if (!user) {
            return res.status(200).json(createResponse(-4, 'Bạn không có quyền truy cập chức năng này', null));
        }

        req.body.U_Id = decodedToken.data.U_Id;
        next();

    } catch (error) {
        console.error('Error verifying JWT:', error);
        return res.status(200).json(createResponse(-3, 'Token không hợp lệ', null));
    }
};



module.exports = {
    createJWTDefault, createJWTChangePassword, verifyTokenUser
}