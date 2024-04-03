import db from "../models/index";
const { Op, literal } = require('sequelize');

//-----------------------------------------------Booking----------------------------------//
const checkBookingConditionNoAccount = async (bookingTime, ip, storeId) => {
    try {
        const startTime = new Date(bookingTime - (2 * 60 * 60 * 1000 + 60 * 1000)); // Thời gian bắt đầu (bookingTime)
        const endTime = new Date(bookingTime + (2 * 60 * 60 * 1000 - 60 * 1000)); // Thời gian kết thúc (2 giờ sau bookingTime)
        // Tìm xem có bất kỳ đặt bàn nào trong khoảng thời gian từ startTime đến endTime không
        const bookingCount = await db.Reserve_Ticket.count({
            where: {
                RT_Ip: ip,
                CS_Id: storeId,
                RT_DateTimeArrival: {
                    [Op.between]: [startTime, endTime]
                }
            }
        });
        // Trả về true nếu không có đặt bàn nào trong khoảng thời gian đó, ngược lại trả về false
        return bookingCount === 0;
    } catch (error) {
        console.error('Error checkIng booking condition with no account', error);
        throw error;
    }
};

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

const findAllCoffeeStoreByName = async (name) => {
    try {
        const coffeeStores = await db.Coffee_Store.findAll({
            where: literal(`LOWER(CS_Name) LIKE LOWER('%${name}%')`),           // Tìm kiếm hoa và thường
            attributes: ['CS_Id', 'CS_Name', 'CS_Location', 'CS_MaxPeople', 'CS_TimeOpen', 'CS_TimeClose'],
        });
        return coffeeStores;
    } catch (error) {
        console.error('Error finding all coffee store :', error);
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
        // console.log('find ID coffee', coffeeStore && coffeeStore.CS_Id);
        return coffeeStore ? coffeeStore.CS_Id : null;
    } catch (error) {
        console.error('Error finding store ID by manager ID:', error);
        return null;
    }
};

let findReserveTicketToMonth = async (month, id) => {
    try {
        const startDate = new Date(+month);
        startDate.setDate(1);
        const endDate = new Date(+month);
        endDate.setMonth(endDate.getMonth() + 1);

        const newRecord = await db.Reserve_Ticket.findAll({
            where: {
                CS_Id: id,
                RT_DateTimeArrival: {
                    [Op.between]: [startDate, endDate]
                }
            },
            // include: 'User',
            include: [{
                model: db.Coffee_Store,
                attributes: ['CS_Name']
            }],
        });
        return newRecord;

    } catch (error) {
        console.error(`Error finding reserve ticke at store id: ${id} to month records:`, error);
        return null
    }
}

let findAllHolidayToMonth = async (month) => {
    try {

        const startDate = new Date(+month);
        startDate.setDate(1);   // ngày bắt đầu của tháng

        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0);     // ngày kết thúc của tháng

        const listHoliday = await db.Activity_Schedule.findAll({
            where: {
                AS_Holiday: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: ['AS_Holiday']
        });

        return listHoliday;
    } catch (error) {
        console.error('Error getting holiday list:', error);
        return [];
    }
}

//------------------------------------- Tạo mới-----------------------------------------//

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

let createHoLiday = async (AS_Holiday, CS_Id) => {
    try {
        const newRecord = await db.Activity_Schedule.create({
            AS_Holiday: AS_Holiday,
            CS_Id: CS_Id
        })
        return newRecord ? true : null
    } catch (error) {
        console.error('Error creating Activity Schedule record:', error);
    }
}

let findComment = async (U_Id, CS_Id) => {
    try {
        const newRecord = await db.Comments.findOne({
            where: {
                U_Id: U_Id,
                CS_Id: CS_Id
            }
        })
        return newRecord ? newRecord : null
    } catch (error) {
        console.error('Error find comment record:', error);
    }
}

let findAllCommentsOfStore = async (CS_Id) => {
    try {
        const newRecord = await db.Comments.findAll(
            {
                where: {
                    CS_Id: CS_Id,
                },
                include: [{
                    model: db.User,
                    attributes: ['U_Avatar', 'U_Name']
                }],
            }
        )
        return newRecord ? newRecord : null
    } catch (error) {
        console.error('Error find comment record:', error);
    }
}

let createComment = async (U_Id, CS_Id, detail, starsNumber) => {
    try {
        const newRecord = await db.Comments.create({
            C_Details: detail,
            C_StarsNumber: starsNumber,
            U_Id: U_Id,
            CS_Id: CS_Id
        })
        return newRecord ? true : null
    } catch (error) {
        console.error('Error creating comment record:', error);
    }
}

let updateComment = async (U_Id, CS_Id, detail, starsNumber) => {
    try {
        const comment = await db.Comments.findOne({
            where: {
                CS_Id: CS_Id,
                U_Id: U_Id
            }
        });
        if (comment) {
            comment.C_Details = detail;
            comment.C_StarsNumber = starsNumber;
            await comment.save();

            return true;
        } else {
            console.log('Không tìm thấy bình luận để cập nhật');
            return null;
        }
    } catch (error) {
        console.error('Error updating comment record:', error);
        return null;
    }
};

let deleteComment = async (U_Id, CS_Id,) => {
    try {
        const deletedRecordCount = await db.Comments.destroy({
            where: {
                U_Id: U_Id,
                CS_Id: CS_Id
            }
        });
        return deletedRecordCount > 0 ? true : false;
    } catch (error) {
        console.error('Error deleting comment record:', error);
        return false;
    }
};


//--------------------------------------Cập nhật----------------------------------------------//
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
    // Booking
    checkBookingConditionNoAccount,

    // Find
    findCoffeeStoreById,
    findAllCoffeeStoreByName,
    findCoffeeStoreDetailById,
    findMenusByCoffeeStoreId,
    findServicesByCoffeeStoreId,
    findTagsByCoffeeStoreId,
    findCoffeeStoreByIdManager,
    findCoffeeStoreIdByManagerId,
    findReserveTicketToMonth,
    findAllHolidayToMonth,
    createHoLiday,

    // Create
    createCoffeeStore,
    createMenusFromList,
    createServicesFromList,

    // update
    updateCoffeeStoreRecord,
    updateMenusCoffeeStore,
    updateServicesCoffeeStore,

    findComment,
    findAllCommentsOfStore,
    createComment,
    updateComment,
    deleteComment
}
