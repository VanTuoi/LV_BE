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

        let listBooking = await managerServices.findBokingScheduleToMonth(month)

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
        const month = req.query.AS_Holiday

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

    console.log('', req.body.AS_Holiday, req.body.CS_Id);
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

//-------------------------------------------------check in--------------------------------------------//

const checkIn = async (req, res) => {

    let RT_Id = +req.body.RT_Id;

    if (RT_Id) {
        try {
            let timeDifferenceInMinutes = await userServices.checkTimeTicket(RT_Id)     // số phút lệch của phiếu so với hiện tại
            let status = await userServices.findLatestStatusByTicketId(RT_Id)               // Trạng thái hiện tại của phiếu
            let timeCheckIn = await userServices.findTimeCreateLatestStatusByTicketId(RT_Id)

            if (status && timeDifferenceInMinutes) {

                let detail = await userServices.findBookingbyId(RT_Id)

                if (timeDifferenceInMinutes < -15 || status == 'Late') {
                    let timeCreate = await userServices.createStatusBooking(RT_Id, 'Late')
                    return res.status(200).send({
                        errorCode: '0',
                        errorMessage: 'Bạn đã trễ hẹn',
                        data: { detail, timeCreate },
                    });
                }
                if (timeDifferenceInMinutes > 45 && status == 'Waiting') {
                    return res.status(200).send({
                        errorCode: '0',
                        errorMessage: 'Chưa đến hẹn',
                        data: { detail, timeCheckIn: null },
                    });
                }
                if ((timeDifferenceInMinutes >= -45 || timeDifferenceInMinutes <= 15) && status == 'Waiting') {
                    let timeCreate = await userServices.createStatusBooking(RT_Id, 'Has Arrived')
                    return res.status(200).send({
                        errorCode: '0',
                        errorMessage: 'Bạn đã check in thành công',
                        data: { detail, timeCreate },
                    });
                }
                // console.log('', timeDifferenceInMinutes, status);
                return res.status(200).send({
                    errorCode: '0',
                    errorMessage: 'Bạn đã check in rồi',
                    data: { detail, timeCheckIn },
                });

            } else {
                return res.status(200).send({
                    errorCode: '0',
                    errorMessage: 'Không tìm thấy thông tin đặt bàn',
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
    } else {
        return res.status(201).send({
            errorCode: '-1',
            errorMessage: 'Dữ liệu check in không đủ',
            data: null
        });
    }
}




module.exports = {
    scheduleBooking, listHoliday, createAHoliday, checkIn
}