import managerServices from '../services/ManagerServices'
import db from "../models/index";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ScheduleBooking = async (req, res) => {
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

const ListHoliday = async (req, res) => {
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

const CreateAHoliday = async (req, res) => {
    try {

        if (req.body.AS_Holiday && req.body.BS_Id) {

            const date = new Date(+req.body.AS_Holiday)

            let status = await managerServices.setVacationListServices(date, req.body.BS_Id)
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

module.exports = {
    ScheduleBooking, ListHoliday, CreateAHoliday
}