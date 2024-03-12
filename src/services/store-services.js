import db from "../models/index";

//-------------------------------------------- Tìm kiếm --------------------------------//
const findCoffeeStoreById = async (id) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
            attributes: ['CS_Id', 'CS_Name', 'CS_Location'],
        });
        return coffeeStore;
    } catch (error) {
        console.error('Error finding coffee store details:', error);
        return null;
    }
};

const findCoffeeStoreDetailById = async (id) => {
    try {
        const coffeeStoreDetail = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
            attributes: ['CS_Detail'],
        });
        return coffeeStoreDetail;
    } catch (error) {
        console.error('Error finding coffee store detail:', error);
        return null;
    }
};

const findMenusByCoffeeStoreId = async (id) => {
    try {
        const menus = await db.Menus.findAll({
            where: { CS_Id: id },
        });
        return menus;
    } catch (error) {
        console.error('Error finding menus of coffee store:', error);
        return null;
    }
};

const findServicesByCoffeeStoreId = async (id) => {
    try {
        const services = await db.Services.findAll({
            where: { CS_Id: id },
        });
        return services;
    } catch (error) {
        console.error('Error finding services of coffee store:', error);
        return null;
    }
};

const findTagsByCoffeeStoreId = async (id) => {
    try {
        const tags = await db.Tags.findOne({
            where: { CS_Id: id },
        });
        return tags;
    } catch (error) {
        console.error('Error finding tags of coffee store:', error);
        return null;
    }
};

const findCoffeeStoreByIdManager = async (id) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { M_Id: id },
            include: [db.Menus, db.Services, db.Tags]
        });
        return coffeeStore || null;
    } catch (error) {
        console.error('Error finding coffee store record:', error);
        return null;
    }
};

const findCoffeeStoreIdByManagerId = async (managerId) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { M_Id: managerId }
        });
        console.log('coffeeStore', coffeeStore);
        return coffeeStore ? coffeeStore.CS_Id : null;
    } catch (error) {
        console.error('Error finding store ID by manager ID:', error);
        return null;
    }
};


//----------------------------------------------- Tạo mới-----------------------------------------//

const createCoffeeStore = async (id, name, location, detail) => {
    try {
        const newRecord = await db.Coffee_Store.create({
            CS_Name: name,
            CS_Location: location,
            CS_Detail: detail,
            M_Id: id
        });
        return newRecord;
    } catch (error) {
        console.error('Error creating store coffee record:', error);
        throw error;
    }
};

const createMenusFromList = async (store_Id, listMenus) => {
    try {
        for (const menu of listMenus) {
            await db.Menus.create({
                M_Name: menu.M_Name,
                M_Price: menu.M_Price,
                CS_Id: store_Id
            });
        }
        return true;
    } catch (error) {
        console.error('Error creating menus for coffee store record:', error);
        throw error;
    }
};

const createServicesFromList = async (store_Id, listServices) => {
    try {
        for (const service of listServices) {
            await db.Services.create({
                S_Name: service.S_Name,
                S_IsAvailable: service.S_IsAvailable === true,
                S_Describe: service.S_Describe ? service.S_Describe : null,
                CS_Id: store_Id
            });
        }
        return true;
    } catch (error) {
        console.error('Error creating services for coffee store record:', error);
        throw error;
    }
};

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
    // Find
    findCoffeeStoreById,
    findCoffeeStoreDetailById,
    findMenusByCoffeeStoreId,
    findServicesByCoffeeStoreId,
    findTagsByCoffeeStoreId,
    findCoffeeStoreByIdManager,
    findCoffeeStoreIdByManagerId,
    // Create
    createCoffeeStore,
    createMenusFromList,
    createServicesFromList,

    updateCoffeeStoreRecord
}
