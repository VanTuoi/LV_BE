import db from "../models/index";
const { Op, literal } = require('sequelize');
const Sequelize = require('sequelize');

//---------------------------------------------  Of Booking----------------------------------//

const checkBookingConditionNoAccount = async (bookingTime, ip, storeId) => {
    try {
        const startTime = new Date(bookingTime - (2 * 60 * 60 * 1000 + 60 * 1000)); //1h59p
        const endTime = new Date(bookingTime + (2 * 60 * 60 * 1000 - 60 * 1000));   //1h59p
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
        return bookingCount === 0;
    } catch (error) {
        console.error('Error checkIng booking condition with no account', error);
        throw error;
    }
};

//------------------------------------------------Of Manager----------------------------------------//

const findOverViewBookingByMonth = async (id, firstDayOfMonth, lastDayOfMonth) => {
    try {
        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                CS_Id: id,
                createdAt: {
                    [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                }
            },
            attributes: {
                include: [
                    [Sequelize.literal(`(
                        SELECT SRT_Describe
                        FROM Status_Reserve_Ticket
                        WHERE 
                        Reserve_Ticket.RT_Id = Status_Reserve_Ticket.RT_Id
                        ORDER BY createdAt DESC
                        LIMIT 1
                    )`), 'SRT_Describe'],
                ]
            }
        });

        const statusByDate = {};

        const startDate = new Date(firstDayOfMonth);
        const endDate = new Date(lastDayOfMonth);
        const dateList = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const currentDateISOString = currentDate.toISOString().split('T')[0];
            if (!statusByDate[currentDateISOString]) {
                statusByDate[currentDateISOString] = {
                    'Late': 0,
                    'Has Arrived': 0,
                    'Waiting': 0
                };
            }
            dateList.push({ date: currentDateISOString, statuses: statusByDate[currentDateISOString] });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        bookingField.forEach(item => {
            const date = item.dataValues.RT_DateTimeArrival.toISOString().split('T')[0]; // Lấy ngày từ timestamp

            const status = item.dataValues.SRT_Describe
            if (!statusByDate[date]) {
                statusByDate[date] = {
                    'Late': 0,
                    'Has Arrived': 0,
                    'Waiting': 0
                };
            }

            if (status) {
                statusByDate[date][status] = (statusByDate[date][status] || 0) + 1;
            }
        });

        // console.log('statusByDate', statusByDate);

        return dateList;
    } catch (error) {
        console.error('Error finding all booking field today by id store', error);
        throw error;
    }
}



const findReserveTicketOfCoffeeStoreToDay = async (startDay, endDay, id) => {
    try {
        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                CS_Id: id,
                RT_DateTimeArrival: {
                    [Op.between]: [startDay, endDay]
                }
            },
            order: [['RT_DateTimeArrival', 'ASC']],
            attributes: ['RT_DateTimeArrival', 'RT_Id', 'RT_NumberOfParticipants',],
            include: [
                {
                    model: db.Status_Reserve_Ticket,
                    attributes: ['SRT_Describe', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                },
                {
                    model: db.User,
                    attributes: ['U_Name', 'U_PhoneNumber', 'U_SpecialRequirements', 'U_PrestigeScore']
                }
            ]
        });
        let list = []
        if (bookingField) {
            for (const item of bookingField) {
                try {
                    const Infor = {
                        R_Id: item.RT_Id ? item.RT_Id : null,
                        U_Name: item.User && item.User.U_Name ? item.User.U_Name : null,
                        U_PhoneNumber: item.User && item.User.U_PhoneNumber ? item.User.U_PhoneNumber : null,
                        U_SpecialRequirements: item.User && item.User.U_SpecialRequirements ? item.User.U_SpecialRequirements : null,
                        U_PrestigeScore: item.User && item.User.U_PrestigeScore ? item.User.U_PrestigeScore : null,
                        RT_DateTimeArrival: item.RT_DateTimeArrival ? item.RT_DateTimeArrival : null,
                        RT_NumberOfParticipants: item.RT_NumberOfParticipants ? item.RT_NumberOfParticipants : null,
                        RT_Status: item.Status_Reserve_Tickets && item.Status_Reserve_Tickets[0] && item.Status_Reserve_Tickets[0].SRT_Describe ? item.Status_Reserve_Tickets[0].SRT_Describe : null,
                        RT_TimeCheckIn: item.Status_Reserve_Tickets && item.Status_Reserve_Tickets[0] && item.Status_Reserve_Tickets[0].createdAt ? item.Status_Reserve_Tickets[0].createdAt : null
                    };
                    list.push(Infor);
                } catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
        return list;
    } catch (error) {
        console.error('Error finding all booking field today by id store', error);
        throw error;
    }
}

const findReserveTicketOfCoffeeStoreToMonth = async (month, id) => {
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

const findAllReserveTicketOfCoffeeStoreById = async (id) => {
    try {
        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                CS_Id: id,
            },
            order: [['createdAt', 'DESC']],
            attributes: ['RT_DateTimeArrival', 'RT_Id', 'RT_NumberOfParticipants',],
            include: [
                {
                    model: db.Status_Reserve_Ticket,
                    attributes: ['SRT_Describe', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                },
                {
                    model: db.Coffee_Store,
                    attributes: ['CS_Id', 'CS_Name', 'CS_Location', 'CS_Avatar'],
                }
            ]
        });
        let list = []
        if (bookingField) {
            for (const item of bookingField) {
                try {
                    const Infor = {
                        CS_Id: item.Coffee_Store && item.Coffee_Store.CS_Id ? item.Coffee_Store.CS_Id : null,
                        RT_Id: item.RT_Id ? item.RT_Id : null,
                        CS_Name: item.Coffee_Store && item.Coffee_Store.CS_Name ? item.Coffee_Store.CS_Name : null,
                        CS_Avatar: item.Coffee_Store && item.Coffee_Store.CS_Avatar ? item.Coffee_Store.CS_Avatar : null,
                        CS_Location: item.Coffee_Store && item.Coffee_Store.CS_Location ? item.Coffee_Store.CS_Location : null,
                        RT_DateTimeArrival: item.RT_DateTimeArrival ? item.RT_DateTimeArrival : null,
                        RT_NumberOfParticipants: item.RT_NumberOfParticipants ? item.RT_NumberOfParticipants : null,
                        SRT_Describe: item.Status_Reserve_Tickets && item.Status_Reserve_Tickets[0] && item.Status_Reserve_Tickets[0].SRT_Describe ? item.Status_Reserve_Tickets[0].SRT_Describe : null,
                        RT_TimeCheckIn: item.Status_Reserve_Tickets && item.Status_Reserve_Tickets[0] && item.Status_Reserve_Tickets[0].createdAt ? item.Status_Reserve_Tickets[0].createdAt : null
                    };
                    list.push(Infor);
                } catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
        return list;
    } catch (error) {
        console.error('Error finding all booking field by Id store', error);
        throw error;
    }
}

const findHistoryCheckInOfCoffeeStore = async (id) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                CS_Id: id,
                RT_DateTimeArrival: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            },
            attributes: ['RT_DateTimeArrival', 'RT_Id', 'RT_NumberOfParticipants'],
            include: [
                {
                    model: db.Status_Reserve_Ticket,
                    where: {
                        SRT_Describe: {
                            [Op.or]: ['Has Arrived', 'Late']
                        }
                    },
                    attributes: ['SRT_Describe', 'createdAt'],
                },
                {
                    model: db.User,
                    attributes: ['U_Name', 'U_PhoneNumber', 'U_SpecialRequirements', 'U_PrestigeScore']
                }
            ]
        });
        let list = []
        list = bookingField.map(item => {
            const statusReserveTicket = item.Status_Reserve_Tickets[0];
            return {
                R_Id: item.RT_Id,
                U_Name: item.User ? item.User.U_Name : null,
                U_PhoneNumber: item.User ? item.User.U_PhoneNumber : null,
                U_SpecialRequirements: item.User ? item.User.U_SpecialRequirements : null,
                U_PrestigeScore: item.User ? item.User.U_PrestigeScore : null,
                RT_DateTimeArrival: item.RT_DateTimeArrival,
                RT_NumberOfParticipants: item.RT_NumberOfParticipants,
                RT_Status: statusReserveTicket.SRT_Describe,
                RT_TimeCheckIn: statusReserveTicket.createdAt
            };
        });
        list.sort((a, b) => new Date(b.RT_TimeCheckIn) - new Date(a.RT_TimeCheckIn));
        return list;
    } catch (error) {
        console.error('Error finding all booking history field by Id store', error);
        throw error;
    }
}

const findCoffeeStoreByIdManager = async (id) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { M_Id: id },
            include: [db.Menus, db.Services, db.Tags]
        });
        return coffeeStore || null;
    } catch (error) {
        console.error('Error finding coffee store record by id manager', error);
        return null;
    }
};

const findIdCoffeeStoreByManagerId = async (managerId) => {
    try {
        const coffeeStore = await db.Coffee_Store.findOne({
            where: { M_Id: managerId }
        });
        return coffeeStore ? coffeeStore.CS_Id : null;
    } catch (error) {
        console.error('Error finding store ID by manager ID:', error);
        return null;
    }
};

const createCoffeeStore = async (id, name, location, detail, acceptOnline, maxPeople, timeOpen, timeClose, avatar) => {
    try {

        let coverTimeOpen = new Date(timeOpen)
        let coverTimeClose = new Date(timeClose)

        const newRecord = await db.Coffee_Store.create({
            CS_Name: name,
            CS_Avatar: avatar,
            CS_Location: location,
            CS_Detail: detail,
            CS_AcceptOnline: acceptOnline,
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

const createStatusCoffeeStore = async (id) => {
    try {

        const newRecord = await db.Status_Coffee_Store.create({
            SCS_Describe: 'Normal',
            CS_Id: id
        });
        return newRecord;
    } catch (error) {
        console.error('Error creating status store coffee record:', error);
        throw error;
    }
};

const createMenusOfCoffeeStore = async (store_Id, menus) => {
    try {
        for (const menu of menus) {
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

const createServicesOfCoffeeStore = async (store_Id, services) => {
    try {
        for (const service of services) {
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

const createHoLidayOfCoffeeStore = async (holiday, CS_Id) => {
    try {
        const newRecord = await db.Activity_Schedule.create({
            AS_Holiday: holiday,
            CS_Id: CS_Id
        })
        return newRecord ? true : null
    } catch (error) {
        console.error('Error creating Activity Schedule record:', error);
    }
}

const updateCoffeeStoreRecord = async (id, name, location, acceptOnline, maxPeople, timeOpen, timeClose, detail, avatar) => {
    try {
        const storeToUpdate = await db.Coffee_Store.findByPk(id);
        if (!storeToUpdate) {
            throw new Error(`Store with id ${id} not found.`);
        }
        storeToUpdate.CS_Name = name;
        storeToUpdate.CS_Avatar = avatar;
        storeToUpdate.CS_Location = location;
        storeToUpdate.CS_AcceptOnline = acceptOnline;
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

const updateMenusCoffeeStore = async (id, menus) => {
    try {
        for (const updatedMenu of menus) {
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

const updateServicesCoffeeStore = async (id, services) => {
    try {
        for (const updatedServices of services) {
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

const deleteHolidayOfCoffeeStore = async (holiday, CS_Id) => {
    try {
        const numberDestroyed = await db.Activity_Schedule.destroy({
            where: {
                AS_Holiday: holiday,
                CS_Id: CS_Id
            }
        });
        return numberDestroyed > 0 ? true : false;
    } catch (error) {
        console.error('Error deleting Activity Schedule record:', error);
        return false;
    }
}

//-------------------------------------------------- Store---------------------------------------//


const findTopCoffeeStore = async () => {
    try {
        const topRatedStores = await db.Comments.findAll({
            attributes: ['CS_Id', [db.sequelize.fn('AVG', db.sequelize.col('C_StarsNumber')), 'Avg_Stars']],
            include: [
                {
                    model: db.Coffee_Store,
                    attributes: ['CS_Name', 'CS_Location', 'CS_Avatar'],
                }
            ],
            group: ['CS_Id'],
            order: [[db.sequelize.literal('Avg_Stars'), 'DESC']],
            limit: 5
        });
        return topRatedStores.map(store => {
            return {
                CS_Id: store.CS_Id,
                CS_Avg_Stars: parseFloat(store.dataValues.Avg_Stars),
                CS_Name: store.Coffee_Store.CS_Name,
                CS_Location: store.Coffee_Store.CS_Location,
                CS_Avatar: store.Coffee_Store.CS_Avatar
            };
        });
    } catch (error) {
        console.error('Error finding topRatedStores', error);
        return null;
    }
};

const findCoffeeStoreById = async (id) => {
    try {
        const coffeeStore = await db.Coffee_Store.findByPk(id, {
            attributes: [
                'CS_Id',
                'CS_Name',
                'CS_Avatar',
                'CS_Location',
                'CS_AcceptOnline',
                'CS_MaxPeople',
                'CS_TimeOpen',
                'CS_TimeClose',
                [
                    Sequelize.literal(`(
                        SELECT SCS_Describe
                        FROM Status_Coffee_Store
                        WHERE 
                        Status_Coffee_Store.CS_Id = Coffee_Store.CS_Id
                        ORDER BY createdAt DESC
                        LIMIT 1
                    )`),
                    'CS_Status'
                ]
            ],
            raw: true // Sử dụng raw: true để Sequelize không phân tích cú pháp câu lệnh SQL
        });
        return coffeeStore;
    } catch (error) {
        console.error('Error finding coffee store details: by id', error);
        return null;
    }
};

const findAllCoffeeStoreByName = async (name, time, people) => {
    try {
        const coffeeStores = await db.Coffee_Store.findAll({
            attributes: [
                'CS_Id',
                'CS_Name',
                'CS_Avatar',
                'CS_Location',
                'CS_MaxPeople',
                'CS_TimeOpen',
                'CS_TimeClose',
                [literal('(SELECT SCS_Describe FROM Status_Coffee_Store WHERE Coffee_Store.CS_Id = Status_Coffee_Store.CS_Id ORDER BY createdAt DESC LIMIT 1)'), 'SCS_Describe']
            ],
            where: {
                [Op.and]: [
                    literal(`LOWER(CS_Name) LIKE LOWER('%${name}%')`),
                    { CS_MaxPeople: { [Op.gte]: people } },
                    {
                        CS_TimeOpen: { [Op.lte]: time },
                        CS_TimeClose: { [Op.gte]: time }
                    }
                ]
            }
        });
        const list = [];
        for (const coffeeStore of coffeeStores) {
            if (coffeeStore.dataValues.SCS_Describe === 'Normal') {

                list.push(coffeeStore);
            }
        }
        return list;
    } catch (error) {
        console.error('Error finding all coffee store by name:', error);
        return null;
    }
};

const findAllHolidaysOfCoffeeStoreToMonth = async (id, month) => {
    try {

        const date = new Date(month);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        const listHoliday = await db.Activity_Schedule.findAll({
            where: {
                CS_Id: id,
                AS_Holiday: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            },
            attributes: ['AS_Holiday']
        });
        return listHoliday;
    } catch (error) {
        console.error('Error getting holidays list:', error);
        return [];
    }
}

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


const findAllCommentsOfStore = async (CS_Id) => {
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

//---------------------------------------------Of User------------------------------------------------------------//
const findCommentOfCoffeeStoreByIdUser = async (U_Id, CS_Id) => {
    try {
        const newRecord = await db.Comments.findOne({
            where: {
                U_Id: U_Id,
                CS_Id: CS_Id
            }
        })
        return newRecord ? newRecord : null
    } catch (error) {
        console.error('Error find comment of user record:', error);
    }
}

const createCommentOfUser = async (U_Id, CS_Id, detail, starsNumber) => {
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

const updateCommentOfUser = async (U_Id, CS_Id, detail, starsNumber) => {
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

const deleteCommentOfUser = async (U_Id, CS_Id,) => {
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



module.exports = {
    //  Of Booking
    checkBookingConditionNoAccount,

    //Of Store
    findAllCommentsOfStore,
    findTopCoffeeStore,
    findCoffeeStoreById,
    findAllCoffeeStoreByName,
    findCoffeeStoreDetailById,
    findMenusByCoffeeStoreId,
    findServicesByCoffeeStoreId,
    findTagsByCoffeeStoreId,
    findAllHolidaysOfCoffeeStoreToMonth,

    //Of Manager
    findOverViewBookingByMonth,
    findAllReserveTicketOfCoffeeStoreById,
    findReserveTicketOfCoffeeStoreToMonth,
    findReserveTicketOfCoffeeStoreToDay,
    findHistoryCheckInOfCoffeeStore,
    findCoffeeStoreByIdManager,
    findIdCoffeeStoreByManagerId,
    createCoffeeStore,
    createStatusCoffeeStore,
    createMenusOfCoffeeStore,
    createServicesOfCoffeeStore,
    createHoLidayOfCoffeeStore,
    updateCoffeeStoreRecord,
    updateMenusCoffeeStore,
    updateServicesCoffeeStore,
    deleteHolidayOfCoffeeStore,

    //Of User
    findCommentOfCoffeeStoreByIdUser,
    createCommentOfUser,
    updateCommentOfUser,
    deleteCommentOfUser
}
