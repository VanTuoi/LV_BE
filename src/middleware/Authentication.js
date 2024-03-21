import jwt from 'jsonwebtoken';
import db from "../models/index";
import createResponse from '../helpers/responseHelper';


const createJWT = (id) => {
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

const verifyTokenUser = async (req, res, next) => {
  console.log('run', req.body, req.query, req.headers["x-access-token"]);
  const key = process.env.JWT_SECRET;
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(201).json(createResponse(-1, 'Không tìm thấy token', null)); // Trả về status 201 và thông báo lỗi
  }

  try {
    const decoded = jwt.verify(token, key);
    const user = await db.User.findOne({ where: { U_Id: decoded.data.U_Id } });

    if (!user) {
      return res.status(200).json(createResponse(-4, 'Bạn không có quyền truy cập chức năng này', null)); // Trả về status 403 và thông báo lỗi
    }

    req.user = decoded.data;
    next();

  } catch (error) {
    console.error('Error verifying JWT:', error);
    return res.status(200).json(createResponse(-3, 'Token không hợp lệ', null)); // Trả về status 401 và thông báo lỗi
  }
};

module.exports = {
  createJWT, verifyTokenUser
}