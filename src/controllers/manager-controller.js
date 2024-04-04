
import db from "../models/index";
import createResponse from '../helpers/responseHelper';
import storeServices from '../services/store-services'
import userServices from '../services/user-services'
import imageServices from '../services/image-services'
import managerServices from '../services/manager-services'
import authenticationServices from '../services/authentication-services'

//------------------------------------------------------Store------------------------------------------//
const isManagerAssignedToStore = async (req, res) => {
    const { M_Id: id } = req.body;
    if (!id) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin ID người quản lý'));
    }

    try {
        const storeFound = await storeServices.findCoffeeStoreIdByManagerId(id);

        if (storeFound) {
            return res.status(200).json(createResponse(0, 'Người quản lý đã liên kết với cửa hàng'));
        }

        return res.status(200).json(createResponse(1, 'Người quản lý chưa liên kết với cửa hàng nào'));
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái cửa hàng của người quản lý:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi kiểm tra trạng thái cửa hàng của người quản lý'));
    }
};

const getCoffeeStoreByIdManager = async (req, res) => {
    const { M_Id: id } = req.body;

    if (!id) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin Id'));
    }

    try {
        const coffeeStore = await storeServices.findCoffeeStoreByIdManager(id);

        if (coffeeStore) {
            return res.status(200).json(createResponse(0, 'Tìm thấy', coffeeStore));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy'));
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm cửa hàng cà phê:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tìm kiếm cửa hàng cà phê'));
    }
};

const createCoffeeStore = async (req, res) => {

    const { M_Id: managerId, CS_Name: name, CS_Location: location, CS_Detail: detail,
        CS_MaxPeople: maxPeople, CS_TimeOpen: timeOpen, CS_TimeClose: timeClose,
        CS_ListMenus: listMenu, CS_ListServices: listServices } = req.body;

    if (!managerId || !name || !location || !detail || !listMenu || !listServices) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
    }

    try {
        await db.sequelize.transaction(async (t) => {

            let coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(managerId, t);

            if (coffeeStoreId) return res.status(200).json(createResponse(0, 'Bạn đã quản lý 1 cửa hàng', { have: true }));

            await storeServices.createCoffeeStore(managerId, name, location, detail, maxPeople, timeOpen, timeClose, t);
            coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(managerId, t);

            await storeServices.createMenusFromList(coffeeStoreId, listMenu, t);
            await storeServices.createServicesFromList(coffeeStoreId, listServices, t);

            return res.status(200).json(createResponse(0, 'Tạo thành công', true));
        });
    } catch (error) {
        console.error('Lỗi khi tạo cửa hàng cà phê kèm menus và services', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tạo cửa hàng cà phê kèm menus và services'));
    }
}

const updateCoffeeStore = async (req, res) => {

    const { M_Id: manager_Id, CS_Name: name, CS_Location: location, CS_Detail: detail,
        CS_MaxPeople: maxPeople, CS_TimeOpen: timeOpen, CS_TimeClose: timeClose,
        CS_ListMenus: menus, CS_ListServices: services } = req.body;

    if (!manager_Id || (!name && !location && !detail && !menus && !services)) {
        return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
    }

    try {
        let id = await storeServices.findCoffeeStoreIdByManagerId(manager_Id);

        if (!id) return res.status(200).json(createResponse(2, 'Bạn chưa quản lý cửa hàng nào', null));

        await storeServices.updateCoffeeStoreRecord(id, name, location, maxPeople, timeOpen, timeClose, detail);

        if (menus) await storeServices.updateMenusCoffeeStore(id, menus);
        if (services) await storeServices.updateServicesCoffeeStore(id, services);

        return res.status(200).json(createResponse(0, 'Cập nhật thành công'));

    } catch (error) {
        console.error('Lỗi khi cập nhật cửa hàng cà phê:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi cập nhật cửa hàng cà phê'));
    }
};

const getReserveTicketsToMonth = async (req, res) => {
    try {

        const { M_Id: managerId, month } = req.body;
        const store = await storeServices.findCoffeeStoreById(managerId);

        if (!store) {
            return res.status(200).json(createResponse(0, 'Không tìm thấy cửa hàng'));
        }

        const listBooking = await storeServices.findReserveTicketToMonth(month, store.CS_Id);

        if (listBooking) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách đặt bàn thành công', listBooking));
        }
        return res.status(200).json(createResponse(-1, 'Không có lịch đặt bàn trong tháng này', null));

    } catch (error) {
        console.error('Lỗi khi lấy lịch đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi lấy lịch đặt bàn ', null));
    }
};

const getHolidays = async (req, res) => {
    try {
        const month = req.query.AS_Holiday;

        const listHoliday = await storeServices.findAllHolidayToMonth(month);

        if (listHoliday) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách ngày nghĩ thành công', listHoliday));
        }
        return res.status(200).json(createResponse(-1, 'Lấy danh sách ngày nghĩ không thành công', null));

    } catch (error) {
        console.error('Lỗi tìm kiếm danh sách ngày nghĩ', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm kiếm danh sách ngày nghĩ', null));
    }
};

const createHoliday = async (req, res) => {

    const { CS_Id: CS_Id, AS_Holiday: AS_Holiday } = req.body;

    if (!AS_Holiday || !CS_Id) return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin tạo ngày nghĩ'));

    try {

        const date = new Date(+req.body.AS_Holiday)

        let status = await storeServices.createHoLiday(date, CS_Id)
        if (status) {
            return res.status(200).json(createResponse(0, 'Tạo ngày nghĩ thành công'));
        }
        return res.status(200).json(createResponse(-1, 'Tạo ngày nghĩ thất bại'));

    } catch (error) {
        console.error('Lỗi khi tạo ngày nghĩ:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tạo ngày nghĩ'));
    }
}

const deleteHoliday = async (req, res) => {

}

const checkIn = async (req, res) => {

    const { M_Id: manager_Id, RT_Id: RT_Id } = req.body;

    // console.log('RT_Id', RT_Id);

    if (!RT_Id || !manager_Id) {
        return res.status(201).json(createResponse(-1, 'Dữ liệu check in không đủ', null));
    }
    const store = await storeServices.findCoffeeStoreByIdManager(manager_Id)

    if (!store) {
        return res.status(200).json(createResponse(0, 'Không tìm thấy cửa hàng từ ID manager'));
    }

    try {
        const timeDifferenceInMinutes = await userServices.checkTimeReserveTicket(RT_Id);
        const status = await userServices.findLatestStatusByReserveTicketId(RT_Id);
        const timeCheckIn = await userServices.findTimeCreateLatestStatusByTicketId(RT_Id);

        if (!status || !timeDifferenceInMinutes) {
            return res.status(200).json(createResponse(0, 'Không tìm thấy thông tin đặt bàn', null));
        }

        const detail = await userServices.findReserveTicketbyId(RT_Id);

        if (detail.CS_Id !== store.CS_Id) {
            return res.status(200).json(createResponse(0, 'Phiếu đặt bàn không thuộc về cửa hàng của bạn', null));
        }

        if (status === 'Late') {
            return res.status(200).json(createResponse(0, 'Bạn đã trễ hẹn', { detail, timeCheckIn }));
        }

        if (timeDifferenceInMinutes > 45 && status === 'Waiting') {
            return res.status(200).json(createResponse(0, 'Chưa đến hẹn', { detail, timeCheckIn: null }));
        }

        if (timeDifferenceInMinutes < -15) {
            const timeCreate = await userServices.createStatusReserveTicket(RT_Id, 'Late');
            return res.status(200).json(createResponse(0, 'Bạn đã trễ hẹn', { detail, timeCreate }));
        }


        if ((timeDifferenceInMinutes >= -45 || timeDifferenceInMinutes <= 15) && status === 'Waiting') {
            const timeCreate = await userServices.createStatusReserveTicket(RT_Id, 'Has Arrived');
            return res.status(200).json(createResponse(0, 'Bạn đã check in thành công', { detail, timeCreate }));
        }

        return res.status(200).json(createResponse(0, 'Bạn đã check in rồi', { detail, timeCheckIn }));
    } catch (error) {
        console.error('Lỗi khi check in người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi check in người dùng', null));
    }
};

const uploadImgaePageDetail = async (req, res) => {

    const { M_Id: id, CS_Base64Image: image } = req.body;

    if (!id || !image) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
    }

    try {

        const coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(id);

        if (!coffeeStoreId) { return res.status(200).json(createResponse(-1, 'Không tìm thấy id',)) }

        let urlImage = await imageServices.uploadImage(image, `CS_${coffeeStoreId}_`)

        if (urlImage) {
            return res.status(200).json(createResponse(0, 'Tải ảnh thành công', urlImage))
        }
        return res.status(200).json(createResponse(1, 'Tải ảnh không thành công',))


    } catch (error) {
        console.error('Lỗi khi tải ảnh lên:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tải ảnh lên'));
    }
}

const getImageBanner = async (req, res) => {

    const { M_Id: id, } = req.body;

    if (!id) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
    }

    try {

        const coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(id);

        if (!coffeeStoreId) { return res.status(200).json(createResponse(-1, 'Không tìm thấy id',)) }

        let urlImage = await imageServices.getImageUrls(`CS_${coffeeStoreId}_`)

        if (urlImage) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách ảnh thành công', urlImage))
        }
        return res.status(200).json(createResponse(1, 'Lấy danh sách ảnh không thành công',))


    } catch (error) {
        console.error('Lỗi khi lấy danh sách ảnh', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi lấy danh sách ảnh'));
    }
}

const deleteImageBanner = async (req, res) => {

    const { imageUrl, M_Id: id } = req.body;

    if (!imageUrl || !id) {
        return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
    }

    try {

        const coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(id);

        if (!coffeeStoreId) { return res.status(200).json(createResponse(-1, 'Không tìm thấy id',)) }

        let result = await imageServices.deleteImage(imageUrl)

        if (result) {
            return res.status(200).json(createResponse(0, 'Xóa ảnh thành công', result))
        }
        return res.status(200).json(createResponse(1, 'Xóa ảnh không thành công', result))


    } catch (error) {
        console.error('Lỗi khi xóa ảnh', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi xóa ảnh'));
    }
}

// --------------------------------------------Account----------------------------------------------------//

const getInfor = async (req, res) => {
    try {
        const { M_Id: id, } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let manager = await managerServices.findManagerById(id)

        if (!manager) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy quản lý', null));
        }
        return res.status(200).json(createResponse(0, 'Tìm thấy quản lý', manager));
    } catch (error) {
        console.error('Lỗi khi tìm thông tin quản lý', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tìm thông tin quản lý', null));
    }
}

const updateInfor = async (req, res) => {
    try {
        const { M_Name: name, M_Id: id, M_Email: email, M_PhoneNumber: phone, M_Gender: gender, M_Birthday: birthday } = req.body;

        // console.log('', id, name, email, phone, gender, birthday);

        if (!name || !id || !email || !phone || !gender) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu cập nhật quản lý không đủ', null));
        }
        let haveManager = await managerServices.findManagerById(id)

        if (!haveManager) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy quản lý', null));
        }
        let manager = await managerServices.updateInforManager(id, name, phone, email, gender, birthday)

        if (manager) {
            return res.status(200).json(createResponse(0, 'Cập nhật quản lý thành công', manager));
        }
        return res.status(200).json(createResponse(-3, 'Cập nhật quản lý thất bại', null));
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin quản lý', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi cập nhật thông tin quản lý', null));
    }
}

const changePassword = async (req, res) => {
    try {
        const { M_Id: id, M_Current_Password: currenPassword, M_New_Password: newPassword } = req.body;

        if (!id || !newPassword || !currenPassword) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu đổi mật khẩu quản lý không đủ', null));
        }

        let haveManager = await managerServices.findManagerById(id)

        if (!haveManager) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy quản lý', null));
        }

        let checkPassword = await authenticationServices.comparePassword(currenPassword, haveManager.M_Password)

        if (checkPassword) {
            managerServices.changePassworManager(id, newPassword)
            return res.status(200).json(createResponse(0, 'Cập nhật mật khẩu quản lý thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Mật khẩu hiện tại của bạn không chính xác', null));
        }

    } catch (error) {
        console.error('Lỗi khi thay đổi mật khẩu thông tin quản lý', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi thay đổi mật khẩu thông tin quản lý', null));
    }
}



module.exports = {
    // Store
    isManagerAssignedToStore,
    getCoffeeStoreByIdManager,
    createCoffeeStore,
    updateCoffeeStore,
    getReserveTicketsToMonth,
    getHolidays,
    createHoliday,
    deleteHoliday,
    checkIn,

    uploadImgaePageDetail,
    getImageBanner,
    deleteImageBanner,
    //Account
    getInfor,
    updateInfor,
    changePassword,
}
