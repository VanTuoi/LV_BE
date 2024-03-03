import managerServices from '../services/manager-services'
import userServices from '../services/user-services'
import db from "../models/index";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const scheduleBooking = async (req, res) => {
    try {
        await delay(200)

        const month = req.query.month

        let listBooking = await managerServices.FindBokingScheduleToMonth(month)

        if (listBooking) {
            return res.status(200).json({
                errorCode: '0',
                errorMessage: 'Lấy danh sách đặt bàn thành công',
                data: listBooking
            });
        } else {
            return res.status(200).json({
                errorCode: '-1',
                errorMessage: 'Lấy danh sách đặt bàn không thành công',
                data: listBooking
            });
        }
    } catch (e) {
        return res.status(200).json({
            errorCode: '-5',
            errorMessage: 'Lỗi từ server',
            data: null
        });
    }
}

const listHoliday = async (req, res) => {
    try {
        const month = req.query.month

        let listHoliday = await managerServices.getHoliday(month)

        if (listHoliday) {
            return res.status(200).json({
                errorCode: '0',
                errorMessage: 'Lấy danh sách ngày nghĩ thành công',
                data: listHoliday
            });
        } else {
            return res.status(200).json({
                errorCode: '-1',
                errorMessage: 'Lấy danh sách ngày nghĩ không thành công',
                data: null
            });
        }
    } catch (e) {
        return res.status(200).json({
            errorCode: '-5',
            errorMessage: 'Lỗi từ server',
            data: null
        });
    }
}

const createAHoliday = async (req, res) => {
    try {

        if (req.body.AS_Holiday && req.body.CS_Id) {

            const date = new Date(+req.body.AS_Holiday)

            let status = await managerServices.setVacationListServices(date, req.body.CS_Id)
            if (status === '0') {
                return res.status(200).send('create a holiday succeed!')
            }
            if (status === '1') {
                return res.status(201).send('A record exists that has a check-in time that is too close !')
            }
            if (status === '2') {
                return res.status(201).send('Duplicate record exists')
            }
        }
        return res.status(202).send('Missing params')
    } catch (e) {
        return res.status(500).send('Error from sever')
    }
}
const checkIn = async (req, res) => {
    try {

        let RT_Id = +req.body.RT_Id;

        if (RT_Id) {

            const isValidBookingTime = await userServices.checkBookingCondition(bookingDate, userID, storeID);

            if (isValidBookingTime) {

                const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, userID, storeID);

                if (newRecord) {

                    const ID_lastBokking = await userServices.findLastBookingId(userID, storeID);

                    userServices.createStatusBooking(ID_lastBokking, 'Waiting')

                    const qr = await userServices.createAQrCode({ CS_Id: ID_lastBokking });

                    return res.status(200).send({
                        errorCode: '0',
                        errorMessage: 'Bạn đã đặt bàn thành công',
                        data: qr,
                    });
                }
                else {
                    return res.status(200).send({
                        errorCode: '-1',
                        errorMessage: 'Đặt bàn không thành công',
                        data: null
                    });
                }
            } else {
                console.log('Bạn đã đặt 1 bàn đã đặt gần thời gian đó');

                return res.status(200).send({
                    errorCode: '-1',
                    errorMessage: 'Bạn đã đặt 1 bàn đã đặt gần thời gian đó',
                    data: null
                });
            }
        } else {
            return res.status(201).send({
                errorCode: '-1',
                errorMessage: 'Dữ liệu check in không đủ',
                data: null
            });
        }
    } catch (err) {
        console.log('Error', err);

        return res.status(500).send({
            errorCode: '-5',
            errorMessage: 'Lỗi từ server',
            Data: null
        });
    }
}




module.exports = {
    scheduleBooking, listHoliday, createAHoliday, checkIn
}