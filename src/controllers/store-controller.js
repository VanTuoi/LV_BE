import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';

//--------------------------------------------- Tìm kiếm----------------------------------------------//
const getCoffeeStorebyId = async (req, res) => {

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
        console.log('Lỗi tìm cửa hàng theo id', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm cửa hàng theo id'));
    }
}

const getDetailCoffeeStorebyId = async (req, res) => {
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
        console.log('Lỗi tìm trang giới thiệu cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm trang giới thiệu cửa hàng'));
    }
}

const getMenusCoffeeStorebyId = async (req, res) => {
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
        console.log('Lỗi tìm menu cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm menu cửa hàng'));
    }
}

const getServicesCoffeeStorebyId = async (req, res) => {

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
        console.log('Lỗi tìm dịch vụ cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm dịch vụ cửa hàng'));
    }
}

const getTagsCoffeeStorebyId = async (req, res) => {

}

const getStoresByName = async (req, res) => {

    const name = req.query.store_name;

    try {
        if (!name) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập tên cửa hàng cần tìm'));
        }
        let newRecord = await storeServices.findAllCoffeeStoreByName(name)
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy cửa hàng danh sách cửa hàng', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy cửa hàng nào'));
        }
    } catch (error) {
        console.log('Lỗi tìm cửa hàng theo tên', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm cửa hàng theo tên'));
    }
}

module.exports = {
    getCoffeeStorebyId,
    getDetailCoffeeStorebyId,
    getMenusCoffeeStorebyId,
    getServicesCoffeeStorebyId,
    getTagsCoffeeStorebyId,
    getStoresByName,
}