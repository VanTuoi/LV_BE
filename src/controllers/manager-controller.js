import managerServices from '../services/manager-services'
import userServices from '../services/user-services'
import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';
import db from "../models/index";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------- Schedule--------------------------
const scheduleBooking = async (req, res) => {
    try {
        await delay(200);

        const { manager_Id: manager_Id, month: month } = req.body;
        const store = await storeServices.findCoffeeStoreById(manager_Id)

        if (!store) {
            return res.status(200).json(createResponse(0, 'Không tìm thấy cửa hàng'));
        }

        const listBooking = await managerServices.findBokingScheduleToMonth(month, store.CS_Id);

        if (listBooking) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách đặt bàn thành công', listBooking));
        } else {
            return res.status(200).json(createResponse(-1, 'Lấy danh sách đặt bàn không thành công', null));
        }
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};

const listHoliday = async (req, res) => {
    try {
        const month = req.query.AS_Holiday;

        const listHoliday = await managerServices.getHoliday(month);

        if (listHoliday) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách ngày nghĩ thành công', listHoliday));
        } else {
            return res.status(200).json(createResponse(-1, 'Lấy danh sách ngày nghĩ không thành công', null));
        }
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};

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

    const { manager_Id: manager_Id, RT_Id: RT_Id } = req.body;

    console.log('RT_Id', RT_Id);
    if (!RT_Id || !manager_Id) {
        return res.status(201).json(createResponse(-1, 'Dữ liệu check in không đủ', null));
    }
    const store = await storeServices.findCoffeeStoreById(manager_Id)

    if (!store) {
        return res.status(200).json(createResponse(0, 'Không tìm thấy cửa hàng từ ID manager'));
    }

    try {
        const timeDifferenceInMinutes = await userServices.checkTimeTicket(RT_Id);
        const status = await userServices.findLatestStatusByTicketId(RT_Id);
        const timeCheckIn = await userServices.findTimeCreateLatestStatusByTicketId(RT_Id);

        if (!status || !timeDifferenceInMinutes) {
            return res.status(200).json(createResponse(0, 'Không tìm thấy thông tin đặt bàn', null));
        }

        const detail = await userServices.findBookingbyId(RT_Id);

        if (detail.CS_Id !== store.CS_Id) {
            return res.status(200).json(createResponse(0, 'Phiếu đặt bàn không thuộc về cửa hàng của bạn', null));
        }

        if (timeDifferenceInMinutes < -15 || status === 'Late') {
            const timeCreate = await userServices.createStatusBooking(RT_Id, 'Late');
            return res.status(200).json(createResponse(0, 'Bạn đã trễ hẹn', { detail, timeCreate }));
        }

        if (timeDifferenceInMinutes > 45 && status === 'Waiting') {
            return res.status(200).json(createResponse(0, 'Chưa đến hẹn', { detail, timeCheckIn: null }));
        }

        if ((timeDifferenceInMinutes >= -45 || timeDifferenceInMinutes <= 15) && status === 'Waiting') {
            const timeCreate = await userServices.createStatusBooking(RT_Id, 'Has Arrived');
            return res.status(200).json(createResponse(0, 'Bạn đã check in thành công', { detail, timeCreate }));
        }

        return res.status(200).json(createResponse(0, 'Bạn đã check in rồi', { detail, timeCheckIn }));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};

module.exports = {
    scheduleBooking, listHoliday, createAHoliday, checkIn,
}
