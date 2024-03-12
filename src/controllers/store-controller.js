import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';
import db from "../models/index";

const getTheCoffeeStorebyId = async (req, res) => {

    const id = req.params.id;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findCoffeeStoreById(id)
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy cửa hàng', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy cửa hàng'));
        }
    } catch (error) {
        console.log('Error create the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const getDetailTheCoffeeStorebyId = async (req, res) => {
    const { CS_Id: id } = req.query;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findCoffeeStoreDetailById(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy chi tiết giới thiệu', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy chi tiết giới thiệu'));
        }
    } catch (error) {
        console.log('Error create the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const getMenusTheCoffeeStorebyId = async (req, res) => {
    const { CS_Id: id } = req.query;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findMenusByCoffeeStoreId(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy menu', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy menu'));
        }
    } catch (error) {
        console.log('Error create the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const getServicesTheCoffeeStorebyId = async (req, res) => {

    const { CS_Id: id } = req.query;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findServicesByCoffeeStoreId(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách services', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy services'));
        }
    } catch (error) {
        console.log('Error find services the coffee store', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}
const getTagsTheCoffeeStorebyId = async (req, res) => {

}

// ----------------------------------------------For Manager---------------------------------------------//
const checkManagerStoreStatus = async (req, res) => {
    const { M_Id: id } = req.body;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin ID người quản lý'));
        }

        const storeFound = await storeServices.findDetailCoffeeStorebyIdManager(id);

        if (storeFound) {
            return res.status(200).json(createResponse(0, 'Người quản lý đã liên kết với cửa hàng', { have: true }));
        } else {
            return res.status(200).json(createResponse(1, 'Người quản lý chưa liên kết với cửa hàng nào', { have: false }));
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái cửa hàng của người quản lý:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};

const getCoffeeStoreByIdManager = async (req, res) => {
    const { M_Id: id } = req.body;
    try {
        if (!id) return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin Id'));

        const coffeeStore = await storeServices.findCoffeeStoreByIdManager(id);

        if (coffeeStore) return res.status(200).json(createResponse(0, 'Tìm thấy', coffeeStore));
        return res.status(200).json(createResponse(1, 'Không tìm thấy'));
    } catch (error) {
        console.error('Lỗi khi tìm kiếm cửa hàng cà phê:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
};

const createCoffeeStore = async (req, res) => {
    const { M_Id: managerId, CS_Name: name, CS_Location: location, CS_Detail: detail, CS_ListMenu: listMenu, CS_ListServices: listServices } = req.body;

    try {
        if (!managerId || !name || !location || !detail || !listMenu || !listServices) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }

        await db.sequelize.transaction(async (t) => {
            let coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(managerId, t);
            if (coffeeStoreId) {
                return res.status(200).json(createResponse(0, 'Bạn đã quản lý 1 cửa hàng', { have: true }));
            }

            let newCoffeeStore = await storeServices.createCoffeeStore(managerId, name, location, detail, t);
            coffeeStoreId = await storeServices.findCoffeeStoreIdByManagerId(managerId, t);
            let newMenus = await storeServices.createMenusFromList(coffeeStoreId, listMenu, t);
            let newServices = await storeServices.createServicesFromList(coffeeStoreId, listServices, t);

            return res.status(200).json(createResponse(0, 'Tạo thành công', { newCoffeeStore, newMenus, newServices }));
        });
    } catch (error) {
        console.error('Error creating the coffee store with menus and services from Controller:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server'));
    }
}

const updateCoffeeStore = async (req, res) => {
    const { M_Id: manager_Id, CS_Name: name, CS_Location: location, CS_Detail: detail } = req.body;
    try {
        if (!name && !location && !detail && !manager_Id) {
            return res.status(200).json(createResponse(-1, 'Thiếu dữ liệu'));
        }

        let coffee_Id = await storeServices.findCoffeeStoreIdByManagerId(manager_Id)

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

module.exports = {
    getTheCoffeeStorebyId,
    getDetailTheCoffeeStorebyId,
    getMenusTheCoffeeStorebyId,
    getServicesTheCoffeeStorebyId,
    getTagsTheCoffeeStorebyId,

    // Manager
    checkManagerStoreStatus,
    getCoffeeStoreByIdManager,
    createCoffeeStore,

    updateCoffeeStore
}