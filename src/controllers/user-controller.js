const userServices = require('../services/user-services');
import createResponse from '../helpers/responseHelper';

// ----------------------------------------Booking ---------------------------------------------------------//
const testAPI = async (req, res) => {
    let check = await userServices.createStatusBooking('1', 'Has Arrived')
    return res.status(200).send({ check })
}

const checkTimeABooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID, RT_Ip: RT_Ip } = req.body;

        if ((!bookingDate || !storeID) || (!userID && !RT_Ip)) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu check time không đủ', null));
        }

        const isValidBookingTime = await userServices.checkBookingCondition(+bookingDate, +userID, RT_Ip, +storeID);
        if (isValidBookingTime) {
            return res.status(200).json(createResponse(0, 'Tìm thông tin đặt bàn thành công', null));
        }
        return res.status(200).json(createResponse(1, 'Bạn đã đặt trong khoảng thời gian gần đó', isValidBookingTime));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};

const createABooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID, RT_NumberOfParticipants: numberOfParticipants, RT_Ip: ip } = req.body;

        console.log(userID, bookingDate, storeID);

        if (!bookingDate || !storeID || !numberOfParticipants) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu phiếu đặt bàn không đủ', null));
        }

        if (!userID && ip) {
            const IdBooking = await userServices.findBookingbyIp(ip);
            if (IdBooking) {
                let status = await userServices.findLatestStatusByTicketId(IdBooking);
                if (status === 'Waiting') {
                    return res.status(200).json(createResponse(0, 'Bạn đã đặt 1 bàn trước đó', null));
                }
            }

            const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, ip, null, +storeID);
            if (newRecord) {
                const ID_lastBokking = await userServices.findBookingbyIp(ip);
                userServices.createStatusBooking(ID_lastBokking, 'Waiting');
                const qr = await userServices.createAQrCode({ CS_Id: ID_lastBokking });
                return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
            } else {
                return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
            }
        }

        const isValidBookingTime = await userServices.checkBookingCondition(bookingDate, +userID, ip, +storeID);

        if (isValidBookingTime) {
            const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, null, userID, storeID);
            if (newRecord) {
                const ID_lastBokking = await userServices.findLastBookingId(userID, storeID);
                userServices.createStatusBooking(ID_lastBokking, 'Waiting');
                const qr = await userServices.createAQrCode({ CS_Id: ID_lastBokking });
                return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
            } else {
                return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
            }
        } else {
            return res.status(200).json(createResponse(-1, 'Bạn đã đặt 1 bàn đã đặt gần thời gian đó', null));
        }
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};

// --------------------------------------------------manager info----------------------------------------------//

const getInforUser = async (req, res) => {
    try {
        const { U_Id: id, } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let user = await userServices.findUserById(id)

        if (!user) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }
        return res.status(200).json(createResponse(0, 'Tìm thấy người dùng', user));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}

const updateInfo = async (req, res) => {
    try {
        const { U_Name: name, U_Id: id, U_Email: email, U_PhoneNumber: phone, U_Gender: gender, U_Birthday: birthday } = req.body;

        // console.log('', id, name, email, phone, gender, birthday);

        if (!name || !id || !email || !phone || !gender) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu cập nhật người dùng không đủ', null));
        }
        let haveUser = await userServices.findUserById(id)

        if (!haveUser) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }
        let user = await userServices.updateInfoUser(id, name, phone, email, gender, birthday)

        if (user) {
            return res.status(200).json(createResponse(0, 'Cập nhật thành công', user));
        }
        return res.status(200).json(createResponse(-3, 'Cập nhật thất bại', null));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}

module.exports = {
    checkTimeABooking,
    createABooking,

    getInforUser,
    updateInfo,

    testAPI
}
