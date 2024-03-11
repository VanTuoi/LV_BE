import managerServices from '../services/manager-services'
import userServices from '../services/user-services'
import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';
import db from "../models/index";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const scheduleBooking = async (req, res) => {
    try {
        await delay(200);

        const month = req.query.month;

        const listBooking = await managerServices.findBokingScheduleToMonth(month);

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
    const RT_Id = +req.body.RT_Id;

    if (!RT_Id) {
        return res.status(201).json(createResponse(-1, 'Dữ liệu check in không đủ', null));
    }

    try {
        const timeDifferenceInMinutes = await userServices.checkTimeTicket(RT_Id);
        const status = await userServices.findLatestStatusByTicketId(RT_Id);
        const timeCheckIn = await userServices.findTimeCreateLatestStatusByTicketId(RT_Id);

        if (!status || !timeDifferenceInMinutes) {
            return res.status(200).json(createResponse(0, 'Không tìm thấy thông tin đặt bàn', null));
        }

        const detail = await userServices.findBookingbyId(RT_Id);

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


//---------------------------------------------------Manager coffee store------------------------------------------------------------//


const checkManagerHaveStore = async (req, res) => {
    const { M_Id: manager_Id } = req.body;
    try {
        if (!manager_Id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin ID người quản lý'));
        }
        let newRecord = await storeServices.findDetailCoffeeStorebyIdManager(manager_Id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Bạn có quản lý', { have: true }));
        } else {
            return res.status(200).json(createResponse(1, 'Bạn chưa quản lý cửa hàng nào', { have: false }));
        }
    } catch (error) {
        console.log('Error check the manager of coffee store from Controller', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}

const createTheCoffeeStore = async (req, res) => {
    const { M_Id: manager_Id, CS_Name: name, CS_Location: location, CS_Detail: detail, CS_ListMenu: listMenu } = req.body;

    console.log('manager_Id || !name || !location || !detail || !listMenu', manager_Id, name, location, detail, listMenu);

    try {
        if (!manager_Id || !name || !location || !detail || !listMenu) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }

        let newRecord = await storeServices.createCoffeeStoreRecord(manager_Id, name, location, detail);
        // console.log('newRecord', newRecord);
        if (newRecord) {

            let id = await storeServices.findDetailCoffeeStorebyIdManager(manager_Id)       // Lấy Id của store
            console.log('id', id);
            let newRecordMenu = await storeServices.createListMenus(+id.CS_Id, listMenu)

            return res.status(200).json(createResponse(0, 'Tạo thành công', [newRecord, newRecordMenu]));
        } else {
            return res.status(200).json(createResponse(1, 'Tạo thất bại'));
        }
    } catch (error) {
        console.log('Error create the coffee store from Controller', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}

const getDetailTheCoffeeStorebyIdManager = async (req, res) => {
    const { M_Id: Id } = req.query;

    try {
        if (!Id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }
        let newRecord = await storeServices.findDetailCoffeeStorebyIdManager(Id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy'));
        }
    } catch (error) {
        console.log('Error create the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const updateTheCoffeeStore = async (req, res) => {
    const { M_Id: manager_Id, CS_Name: name, CS_Location: location, CS_Detail: detail } = req.body;
    try {
        if (!name && !location && !detail && !manager_Id) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }

        let coffee_Id = await storeServices.findIdCoffeeStoreByIdManager(manager_Id)

        if (!coffee_Id) {
            return res.status(200).json(createResponse(2, 'Bạn chưa quản lý cửa hàng nào', null));
        }

        let newRecord = await storeServices.updateCoffeeStoreRecord(coffee_Id, name, location, detail);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Cập nhật thành công', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Cập nhật thất bại'));
        }
    } catch (error) {
        console.log('Error update the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}

const createTheMenuCoffeeStore = async (req, res) => {
    const { M_Id: manager_Id, listMenu: listMenu } = req.body;
    try {
        if (!listMenu || !manager_Id) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }
        console.log('listMenu', listMenu);

    } catch (error) {
        console.log('Error update the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}


module.exports = {
    scheduleBooking, listHoliday, createAHoliday, checkIn,

    // Store
    createTheCoffeeStore, getDetailTheCoffeeStorebyIdManager, updateTheCoffeeStore,
    createTheMenuCoffeeStore, checkManagerHaveStore
}