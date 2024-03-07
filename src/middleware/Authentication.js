import jwt from 'jsonwebtoken';
import db from "../models/index";

const createJWT = (id) => {
  const payload = {
    data: {
      U_Id: id
    },
  };

  const key = process.env.JWT_SECRET;

  try {
    const token = jwt.sign(payload, key, { expiresIn: '2h' });
    console.log('Generated token:', token);
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    return null; // Trả về null nếu có lỗi
  }
}

const verifyToken = async (req, res, next) => {
  const key = process.env.JWT_SECRET;
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({
      errorCode: '0',
      errorMessage: 'Không tìm thấy token',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, key);

    // Xác nhận người dùng tồn tại trong DB
    const user = await db.User.findOne({ where: { U_Id: decoded.data.U_Id } });
    if (!user) {
      return res.status(403).json({
        errorCode: '2',
        errorMessage: 'Bạn không có quyền truy cập chức năng này',
        data: null
      });
    }

    // Nếu người dùng tồn tại, gán thông tin decoded vào req và tiếp tục
    req.user = decoded.data;
    next();

  } catch (error) {
    console.error("Có lỗi xảy ra khi xác thực Token người dùng", error);
    res.status(401).json({
      errorCode: '3',
      errorMessage: 'Token không hợp lệ',
      data: null
    });
  }
};



module.exports = {
  createJWT, verifyToken
}