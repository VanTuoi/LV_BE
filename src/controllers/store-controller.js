import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';
import db from "../models/index";

const getTheCoffeeStorebyId = async (req, res) => {

    const id = req.params.id;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }
        let newRecord = await storeServices.findCoffeeStorebyId(id);
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
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }
        let newRecord = await storeServices.findDetailCoffeeStorebyId(id);
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
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập đủ thông tin'));
        }
        let newRecord = await storeServices.findMenusCoffeeStorebyId(id);
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
const getTagsTheCoffeeStorebyName = async (req, res) => {

}

module.exports = {
    getTheCoffeeStorebyId, getDetailTheCoffeeStorebyId, getMenusTheCoffeeStorebyId
}