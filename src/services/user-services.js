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
        return newRecord.updatedAt;
    } catch (error) {
        console.error('Error creating booking record:', error);
        return null
    }
};

const checkTimeTicket = async (Reserve_Ticket_ID) => {
    try {
        let record = await findBookingbyId(Reserve_Ticket_ID)
        if (record) {
            let timeArrival = new Date(record.RT_DateTimeArrival)
            const currentTime = new Date();
            const timeDifference = timeArrival.getTime() - currentTime.getTime();
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            // console.log('timeDifferenceInMinutes', timeDifferenceInMinutes);
            return timeDifferenceInMinutes
        } else {
            return null
        }

    } catch (error) {
        console.error('Error check time ticket:', error);
        return null;
    }
}

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

        return latestStatusRecord.dataValues.SRT_Describe;
    } catch (error) {
        console.error('Error finding the latest status record:', error);
        return null;
    }
};

const findTimeCreateLatestStatusByTicketId = async (Reserve_Ticket_ID) => {
    try {
        const latestStatusRecord = await db.Status_Reserve_Ticket.findOne({
            where: { RT_Id: Reserve_Ticket_ID },
            order: [['createdAt', 'DESC']] // Sắp xếp giảm dần dựa vào trường createdAt
        });
        // console.log('latestStatusRecord', latestStatusRecord);
        if (!latestStatusRecord) {
            console.log('No status found for the given ticket ID');
            return null;
        }

        return latestStatusRecord.dataValues.updatedAt;
    } catch (error) {
        console.error('Error finding the latest status record:', error);
        return null;
    }
};

const findBookingbyId = async (Id) => {
    try {
        const bookingbyId = await db.Reserve_Ticket.findOne({
            where: {
                RT_Id: Id,
            }
        });
        // console.log('booking', bookingbyId);
        return bookingbyId || null;
    } catch (error) {
        console.error('Error finding last booking', error);
        throw error;
    }
};

const findBookingbyIp = async (ip) => {
    try {
        const bookingField = await db.Reserve_Ticket.findOne({
            where: {
                RT_Ip: ip,
            },
        });
        return bookingField ? bookingField.dataValues.RT_Id : null;
    } catch (error) {
        console.error('Error finding booking field by IP', error);
        throw error;
    }
};

const findLastBookingId = async (userId, storeId) => {
    try {
        const lastBookingId = await db.Reserve_Ticket.max('RT_Id', {
            where: {
                U_Id: userId,
                CS_Id: storeId
            }
        });
        // console.log('Last booking ID:', lastBookingId);
        return lastBookingId || null;
    } catch (error) {
        console.error('Error finding last booking ID:', error);
        throw error;
    }
};

const checkBookingCondition = async (bookingTime, userId, storeId) => {
    try {
        const startTime = new Date(bookingTime - (2 * 60 * 60 * 100 + 60 * 1000)); // Thời gian bắt đầu (bookingTime)
        const endTime = new Date(bookingTime + (2 * 60 * 60 * 1000 - 60 * 1000)); // Thời gian kết thúc (2 giờ sau bookingTime)

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

const createBookingRecord = async (bookingDate, numberOfParticipants, userIp, userId, storeId) => {
    try {
        const newRecord = await db.Reserve_Ticket.create({
            RT_DateTimeArrival: bookingDate,
            RT_NumberOfParticipants: numberOfParticipants,
            RT_Ip: userIp,
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


module.exports = {
    // Find
    findBookingbyIp,
    findLastBookingId,
    findBookingbyId,
    findLatestStatusByTicketId,                      // --> No account
    findTimeCreateLatestStatusByTicketId,           // --> No account

    checkBookingCondition,
    checkTimeTicket,

    createStatusBooking,
    createAQrCode,
    createBookingRecord,
}
