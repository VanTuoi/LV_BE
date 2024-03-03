const { Op } = require('sequelize');
const QRCode = require('qrcode')
const bcrypt = require('bcrypt');

import db from "../models/index";
import { creatJWT } from '../middleware/authentication'



// ----------------------------------------Booking ---------------------------------------------------------//
const createStatusBooking = async (Reserve_Ticket_ID, status) => {
    try {
        const newRecord = await db.Status_Reserve_Ticket.create({
            RT_Id: Reserve_Ticket_ID,
            SRT_Describe: status,
        });
        return newRecord;
    } catch (error) {
        console.error('Error creating booking record:', error);
        return null
    }
};
const findLatestStatusByTicketId = async (Reserve_Ticket_ID) => {
    try {
        const latestStatusRecord = await db.Status_Reserve_Ticket.findOne({
            where: { RT_Id: Reserve_Ticket_ID },
            order: [['createdAt', 'DESC']] // Sắp xếp giảm dần dựa vào trường createdAt
        });

        if (!latestStatusRecord) {
            console.log('No status found for the given ticket ID');
            return null;
        }

        return latestStatusRecord;
    } catch (error) {
        console.error('Error finding the latest status record:', error);
        return null;
    }
};


const findLastBookingId = async (userId, storeId) => {
    try {
        const lastBookingId = await db.Reserve_Ticket.max('CS_Id', {
            where: {
                U_Id: userId,
                CS_Id: storeId
            }
        });
        console.log('Last booking ID:', lastBookingId);
        return lastBookingId || null;
    } catch (error) {
        console.error('Error finding last booking ID:', error);
        throw error;
    }
};

const checkBookingCondition = async (bookingTime, userId, storeId) => {
    try {
        const startTime = new Date(bookingTime - 2 * 60 * 60 * 100 + 60 * 1000); // Thời gian bắt đầu (bookingTime)
        const endTime = new Date(bookingTime + 2 * 60 * 60 * 1000 - 60 * 1000); // Thời gian kết thúc (2 giờ sau bookingTime)

        // Tìm xem có bất kỳ đặt bàn nào trong khoảng thời gian từ startTime đến endTime không
        const bookingCount = await db.Reserve_Ticket.count({
            where: {
                U_Id: userId,
                CS_Id: storeId,
                RT_DateTimeArrival: {
                    [Op.between]: [startTime, endTime]
                }
            }
        });

        // Trả về true nếu không có đặt bàn nào trong khoảng thời gian đó, ngược lại trả về false
        return bookingCount === 0;
    } catch (error) {
        console.error('Error checkIng booking condition:', error);
        throw error;
    }
};

const createBookingRecord = async (bookingDate, numberOfParticipants, userId, storeId) => {
    try {
        const newRecord = await db.Reserve_Ticket.create({
            RT_DateTimeArrival: bookingDate,
            RT_NumberOfParticipants: numberOfParticipants,
            U_Id: userId,
            CS_Id: storeId
        });
        return newRecord;
    } catch (error) {
        console.error('Error creating booking record:', error);
        throw error;
    }
};

const createAQrCode = (data) => {
    return new Promise((resolve, reject) => {
        let stringdata = JSON.stringify(data);

        const options = {
            errorCorrectionLevel: 'H', // Mức độ sửa lỗi (L, M, Q, H)
            type: 'image/png', // Định dạng hình ảnh của mã QR
            quality: 1, // Chất lượng hình ảnh (0-1)
            margin: 1, // Khoảng cách lề (đơn vị: module)
            color: {
                dark: '#000000', // Màu cho phần module
                light: '#ffffff' // Màu cho phần nền
            },
            width: 350, // Kích thước của mã QR (đơn vị: pixel)
            height: 350
        };
        QRCode.toDataURL(stringdata, options, function (err, code) {
            if (err) {
                console.log('Error:', err);
                reject(err);
            } else {
                // console.log('QR Code:', code);
                resolve(code);
            }
        });
    });
};


// ------------------------------------------------- Register ----------------------------------------//

let salt = bcrypt.genSaltSync(10);
const handlehashPassword = (password) => {
    let hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword;
}

let getUsers = async (userId) => {
    try {
        let newuser = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email'],
            include: {
                model: db.Group,
                attributes: ['id', 'name'],
            },

            raw: true,
            nest: true,
        })

        // let r = await db.Role.findAll({
        //     include: { model: db.Group, where: { id: 1 } },
        //     attributes: ['id', 'name', 'email'],
        //     raw: true,
        //     nest: true
        // })
        if (newuser) {
            console.log('check new user', newuser);

            // Cookies that have not been signed
            return newuser
        }
        else {
            console.log('not find user');
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

let createUser = async (userInfo) => {
    // console.log('hehe')
    // return true
    try {
        await db.User.create({
            email: '123@',
            password: '123',
            username: 'van tuoi 4',
        })
        return true
    } catch (e) {
        console.log("error", e);
        return false
    }
}
let checkEmail = async (email) => {
    let check = await db.User.findOne({
        where: { email: email }
    })
    return check
}

let registerUser = async (data) => {
    try {
        let check = await checkEmail(data.email)
        if (check) {
            return {
                EM: 'Email is already exist',
                EC: 1,
                DT: '',
            }
        } else {
            let hashPassword = handlehashPassword(data.password);
            await db.User.create({
                email: data.email,
                username: data.username,
                password: hashPassword,
            })
            return {
                EM: 'Register is success !',
                EC: 0,
                DT: '',
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Somthing wrongs in services',
            EC: 2,
            DT: '',
        }
    }
}
const comparePassword = async (inputPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};
function delayOnServer(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
let login = async (data) => {
    try {

        let account = await db.User.findOne({
            where: { email: data.email },
        })
        let jwt = null
        if (!account) {
            return {
                // EM: 'Account does not exist',
                EM: 'Không tìm thấy tài khoản !',
                EC: 1,
                DT: {
                    jwt
                },
            }
        } else {
            let check = await comparePassword(data.password, account.password);
            // let b = await delayOnServer(5000);                                      // test hàm delay
            if (check) {
                jwt = await creatJWT(data.email);
                return {
                    EM: 'login is success !',
                    EC: 0,
                    DT: {
                        jwt
                    },
                }
            } else {
                return {
                    // EM: 'incorrect password',
                    EM: 'Mật khẩu không đúng !',
                    EC: 2,
                    DT: {
                        jwt
                    },
                }
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Somthing wrongs in services',
            EC: 2,
            DT: '',
        }
    }
}

module.exports = {
    getUsers, createUser, registerUser, login,
    createAQrCode, createBookingRecord, checkBookingCondition, findLastBookingId,

    createStatusBooking
}
