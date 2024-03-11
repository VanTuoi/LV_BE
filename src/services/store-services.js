import db from "../models/index";


const findCoffeeStorebyId = async (id) => {
    try {
        const newRecord = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
            attributes: ['CS_Id', 'CS_Name', 'CS_Location'],
        });
        return newRecord;
    } catch (error) {
        console.error('Error find details store coffee record:', error);
        return null
    }
};

const findDetailCoffeeStorebyIdManager = async (id) => {
    try {
        const newRecord = await db.Coffee_Store.findOne({
            where: { M_Id: id },
        });
        if (newRecord) {
            return newRecord.CS_Detail
        }
        return null
    } catch (error) {
        console.error('Error find store coffee record:', error);
        return null
    }
};


const findDetailCoffeeStorebyId = async (id) => {
    try {
        const newRecord = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
        });
        return newRecord;
    } catch (error) {
        console.error('Error find details store coffee record:', error);
        return null
    }
};

const findMenusCoffeeStorebyId = async (id) => {
    try {
        const newRecord = await db.Menus.findAll({
            where: { CS_Id: id },
        });
        return newRecord;
    } catch (error) {
        console.error('Error find menus store coffee record:', error);
        return null
    }
};

const findTagsCoffeeStorebyId = async (id) => {
    try {
        const newRecord = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
        });
        return newRecord;
    } catch (error) {
        console.error('Error find tags store coffee record:', error);
        return null
    }
};

const findIdCoffeeStoreByIdManager = async (id) => {
    try {
        const newRecord = await db.Coffee_Store.findOne({
            where: { M_Id: id },
        });
        if (newRecord) {
            return newRecord.CS_Id
        }
        return null;
    } catch (error) {
        console.error('Error find id store coffee by manager id:', error);
        throw error;
    }
}


const createCoffeeStoreRecord = async (manager_Id, name, location, detail) => {
    try {
        const newRecord = await db.Coffee_Store.create({
            CS_Name: name,
            CS_Location: location,
            CS_Detail: detail,
            M_Id: manager_Id
        });
        return newRecord;


    } catch (error) {
        console.error('Error creating store coffee record:', error);
        throw error;
    }
};

const createAMenu = async (name, price, store_Id) => {
    try {
        const newRecord = await db.Menus.create({
            M_Name: name,
            M_Price: price,
            CS_Id: store_Id
        });
        if (newRecord) {
            console.log('newRecord', newRecord);
        }
    } catch (error) {
        console.error('Error create a menu item store coffee record:', error);
        throw error;
    }
}

const createListMenus = async (store_Id, listMenus) => {
    try {

        for (const menu of listMenus) {
            console.log(menu.M_Id, menu.M_Name, menu.M_Price);
            createAMenu(menu.M_Name, menu.M_Price, store_Id);
        }
        return true;
    } catch (error) {
        console.error('Error create menu store coffee record:', error);
        return false
    }
}


const updateCoffeeStoreRecord = async (id, name, location, detail) => {
    try {
        // Tìm cửa hàng cà phê bằng ID
        const storeToUpdate = await db.Coffee_Store.findByPk(id);

        if (!storeToUpdate) {
            throw new Error(`Store with id ${id} not found.`);
        }

        // Cập nhật các thuộc tính của bản ghi
        storeToUpdate.CS_Name = name;
        storeToUpdate.CS_Location = location;
        storeToUpdate.CS_Detail = detail;

        // Lưu thay đổi vào cơ sở dữ liệu
        await storeToUpdate.save();

        return storeToUpdate; // Trả về bản ghi sau khi được cập nhật
    } catch (error) {
        console.error('Error updating coffee store record:', error);
        throw error;
    }
};


module.exports = {
    createCoffeeStoreRecord, findDetailCoffeeStorebyId, updateCoffeeStoreRecord,

    findCoffeeStorebyId, findIdCoffeeStoreByIdManager, findDetailCoffeeStorebyIdManager, createListMenus, findMenusCoffeeStorebyId
}
