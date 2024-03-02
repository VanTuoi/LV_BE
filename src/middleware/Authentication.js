import jwt from 'jsonwebtoken';

const creatJWT = (email) => {

  let payload = {
    // data: user.id,
    email: email
  }

  let key = process.env.JWT_SECRET

  let token = null

  try {
    token = jwt.sign(payload, key)
    console.log(token);
  } catch (error) {
    console.log(error);
  }
  return token
}

// const verifyToken = (req, res, next) => {
const verifyToken = (token) => {

  let key = process.env.JWT_SECRET

  // const token = req.body.token || req.query.token || req.headers["x-access-token"];
  // if (!token) {
  //   return res.status(403).json({ message: "Cần có token để xác thực người dùng" });
  // }
  try {
    const decoded = jwt.verify(token, key);
    // const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    // if (decoded.exp < currentTimestamp) {
    //   return res.status(401).send("Token đã hết hạn");
    // }
    // req.user = decoded;
    console.log('xac thuc', decoded);
  } catch (error) {
    // return res.status(401).send("Token không hợp lệ");
    console.log("Token không hợp lệ");

  }

  // return next();
}

module.exports = {
  creatJWT, verifyToken
}