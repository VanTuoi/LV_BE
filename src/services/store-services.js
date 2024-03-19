import db from "../models/index";

//-------------------------------------------- Tìm kiếm --------------------------------//
const findCoffeeStoreById = async (id) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { CS_Id: id },
            attributes: ['CS_Id', 'CS_Name', 'CS_Location', 'CS_MaxPeople', 'CS_TimeOpen', 'CS_TimeClose'],
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
        console.log('find ID coffee', coffeeStore && coffeeStore.CS_Id);
        return coffeeStore ? coffeeStore.CS_Id : null;
    } catch (error) {
        console.error('Error finding store ID by manager ID:', error);
        return null;
    }
};


//----------------------------------------------- Tạo mới-----------------------------------------//

const createCoffeeStore = async (id, name, location, detail, maxPeople, timeOpen, timeClose) => {
    try {

        let coverTimeOpen = new Date(timeOpen)
        let coverTimeClose = new Date(timeClose)

        const newRecord = await db.Coffee_Store.create({
            CS_Name: name,
            CS_Location: location,
            CS_Detail: detail,
            CS_MaxPeople: +maxPeople,
            CS_TimeOpen: coverTimeOpen,
            CS_TimeClose: coverTimeClose,
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

const updateCoffeeStoreRecord = async (id, name, location, maxPeople, timeOpen, timeClose, detail) => {
    try {
        // Tìm cửa hàng cà phê bằng ID
        const storeToUpdate = await db.Coffee_Store.findByPk(id);
        if (!storeToUpdate) {
            throw new Error(`Store with id ${id} not found.`);
        }
        storeToUpdate.CS_Name = name;
        storeToUpdate.CS_Location = location;
        storeToUpdate.CS_MaxPeople = maxPeople;
        storeToUpdate.CS_TimeOpen = timeOpen;
        storeToUpdate.CS_TimeClose = timeClose;
        storeToUpdate.CS_Detail = detail;
        await storeToUpdate.save();

        return storeToUpdate;
    } catch (error) {
        console.error('Error updating coffee store record:', error);
        throw error;
    }
};

const updateMenusCoffeeStore = async (id, updatedMenusList) => {
    try {
        for (const updatedMenu of updatedMenusList) {
            // Kiểm tra nếu M_Id bắt đầu bằng 'D', thực hiện xóa menu
            if (updatedMenu.M_Id.toString().startsWith('D')) {
                const menuIdToDelete = updatedMenu.M_Id.substring(2); // Lấy phần số của ID
                await db.Menus.destroy({
                    where: { M_Id: menuIdToDelete, CS_Id: id }
                });
                // console.log(`Menu with ID ${menuIdToDelete} has been deleted.`);
            }
            // Kiểm tra nếu M_Id bắt đầu bằng 'N', thực hiện thêm mới menu
            else if (updatedMenu.M_Id.toString().startsWith('N')) {
                await db.Menus.create({
                    M_Name: updatedMenu.M_Name,
                    M_Price: updatedMenu.M_Price,
                    CS_Id: id
                });
                // console.log(`New menu has been added.`);
            }
            // Ngược lại, tìm và cập nhật menu hiện tại
            else {
                const menu = await db.Menus.findOne({
                    where: { M_Id: updatedMenu.M_Id, CS_Id: id }
                });
                if (menu) {
                    menu.M_Name = updatedMenu.M_Name;
                    menu.M_Price = updatedMenu.M_Price;
                    await menu.save();
                    // console.log(`Menu with ID ${updatedMenu.M_Id} has been updated.`);
                } else {
                    // console.log(`Menu with ID ${updatedMenu.M_Id} not found.`);
                }
            }
        }
        return true;
    } catch (error) {
        console.error('Error updating menus of coffee store record:', error);
        throw error;
    }
};

const updateServicesCoffeeStore = async (id, updatedServicesList) => {
    try {
        for (const updatedServices of updatedServicesList) {
            const service = await db.Services.findOne({
                where: { S_Id: updatedServices.S_Id, CS_Id: id }
            });
            if (service) {
                service.S_IsAvailable = updatedServices.S_IsAvailable;
                service.S_Name = updatedServices.S_Name;
                service.S_Describe = updatedServices.S_Describe ? updatedServices.S_Describe : null;
                await service.save();
                // console.log(`Services with ID ${updatedServices.S_Id} has been updated.`);
            } else {
                console.log(`Services with ID ${updatedServices.S_Id} not found.`);
            }
        }
    } catch (error) {
        console.error('Error updating services of coffee store record:', error);
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

    // update
    updateCoffeeStoreRecord,
    updateMenusCoffeeStore,
    updateServicesCoffeeStore
}
