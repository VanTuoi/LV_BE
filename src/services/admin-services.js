import db from "../models/index";
const Sequelize = require('sequelize');

const findAllUsers = async () => {
    try {
        const newRecord = await db.User.findAll({
            attributes: {
                include: [
                    // Sử dụng Sequelize.literal để lấy SU_Describe và đặt tên cho nó
                    [Sequelize.literal(`(
                        SELECT SU_Describe
                        FROM Status_User
                        WHERE 
                        Status_User.U_Id = User.U_Id
                        ORDER BY createdAt DESC
                        LIMIT 1
                    )`), 'U_Status'],
                ]
            }
        });
        const flattenedUsers = newRecord.map(user => {
            if (user.U_Password) {
                return {
                    ...user.get({ plain: true }), // Hoặc user.toJSON(),
                    U_Password: 'Đã ẩn'
                };
            }
            return user.get({ plain: true });
        });
        return flattenedUsers;
    } catch (error) {
        console.error('Error find all user', error);
        return null;
    }
};

const lockUser = async (userId) => {
    try {
        const newRecord = await db.Status_User.create({
            U_Id: userId,
            SU_Describe: 'Lock'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error look user', error);
        return null;
    }
}

const unlockUser = async (userId) => {
    try {
        const newRecord = await db.Status_User.create({
            U_Id: userId,
            SU_Describe: 'Normal'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error un look user', error);
        return null;
    }
}

const deleteUser = async (userId) => {
    try {
        await db.Status_User.destroy({
            where: {
                U_Id: userId
            }
        });
        await db.Favorites_List.destroy({
            where: {
                U_Id: userId
            }
        });
        await db.Comments.destroy({
            where: {
                U_Id: userId
            }
        });
        const deletedUser = await db.User.destroy({
            where: {
                U_Id: userId
            }
        });
        return deletedUser ? true : false;
    } catch (error) {
        console.error('Error deleting user', error);
        return null;
    }
}

const findAllManagers = async () => {
    try {
        const newRecord = await db.Manager.findAll({
            attributes: {
                include: [
                    // Sử dụng Sequelize.literal để lấy SU_Describe và đặt tên cho nó
                    [Sequelize.literal(`(
                        SELECT SM_Describe
                        FROM Status_Manager
                        WHERE 
                        Status_Manager.M_Id = Manager.M_Id
                        ORDER BY createdAt DESC
                        LIMIT 1
                    )`), 'M_Status'],
                    [Sequelize.col('Coffee_Store.CS_Name'), 'CS_Name'],
                    [Sequelize.col('Coffee_Store.CS_Id'), 'CS_Id']
                ],
            },
            include: [
                {
                    model: db.Coffee_Store,
                    attributes: []
                }
            ]
        });
        const flattenedManager = newRecord.map(manager => {
            if (manager.M_Password) {
                return {
                    ...manager.get({ plain: true }), // Hoặc user.toJSON(),
                    M_Password: 'Đã ẩn'
                };
            }
            return manager.get({ plain: true });
        });
        return flattenedManager;
    } catch (error) {
        console.error('Error find all manager', error);
        return null;
    }
};

const lockManager = async (managerId) => {
    try {
        const newRecord = await db.Status_Manager.create({
            M_Id: managerId,
            SM_Describe: 'Lock'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error look manager', error);
        return null;
    }
}

const unlockManager = async (managerId) => {
    try {
        const newRecord = await db.Status_Manager.create({
            M_Id: managerId,
            SM_Describe: 'Normal'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error un look manager', error);
        return null;
    }
}

const deleteManager = async (managerId) => {
    try {
        await db.Status_Manager.destroy({
            where: {
                M_Id: managerId
            }
        });
        const deletedManager = await db.Manager.destroy({
            where: {
                M_Id: managerId
            }
        });
        return deletedManager ? true : false;
    } catch (error) {
        console.error('Error deleting manager', error);
        return null;
    }
}

const findAllStores = async () => {
    try {
        const newRecord = await db.Coffee_Store.findAll({
            attributes: {
                exclude: ['CS_Detail'],
                include: [
                    // Sử dụng Sequelize.literal để lấy SU_Describe và đặt tên cho nó
                    [Sequelize.literal(`(
                        SELECT SCS_Describe
                        FROM Status_Coffee_Store
                        WHERE 
                        Status_Coffee_Store.CS_Id = Coffee_Store.CS_Id
                        ORDER BY createdAt DESC
                        LIMIT 1
                    )`), 'CS_Status'],
                    [Sequelize.literal(`(
                        SELECT M_Name
                        FROM Manager
                        WHERE 
                        Manager.M_Id = Coffee_Store.M_Id
                    )`), 'M_Name'],
                ],
            },
        });

        return newRecord;
    } catch (error) {
        console.error('Error find all stores', error);
        return null;
    }

};

const lockStore = async (coffee_Id) => {
    try {
        const newRecord = await db.Status_Coffee_Store.create({
            CS_Id: coffee_Id,
            SCS_Describe: 'Lock'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error look store', error);
        return null;
    }
}

const unlocStore = async (coffee_Id) => {
    try {
        const newRecord = await db.Status_Coffee_Store.create({
            CS_Id: coffee_Id,
            SCS_Describe: 'Normal'
        });

        return newRecord ? true : false;
    } catch (error) {
        console.error('Error un look store', error);
        return null;
    }
}

const deleteStore = async (coffee_Id) => {
    try {
        await db.Activity_Schedule.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        db.Menus.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        await db.Services.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        await db.Status_Coffee_Store.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        await db.Comments.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        const deletedManager = await db.Coffee_Store.destroy({
            where: {
                CS_Id: coffee_Id
            }
        });
        return deletedManager ? true : false;
    } catch (error) {
        console.error('Error deleting manager', error);
        return null;
    }
}

const findAllReports = async () => {
    try {
        const newRecord = await db.Reports.findAll({
            attributes: {
                include: [
                    // Sử dụng Sequelize.literal để lấy SU_Describe và đặt tên cho nó
                    [Sequelize.literal(`(
                        SELECT U_Name
                        FROM User
                        WHERE 
                        User.U_Id = Reports.U_Id
                    )`), 'U_Name'],
                    [Sequelize.literal(`(
                        SELECT CS_Name
                        FROM Coffee_Store
                        WHERE 
                        Coffee_Store.CS_Id = Reports.CS_Id
                    )`), 'CS_Name'],
                ],
            },
        });

        return newRecord;
    } catch (error) {
        console.error('Error find all report', error);
        return null;
    }

};

const changeStatusReport = async (id, feedback) => {
    try {
        const report = await db.Reports.findByPk(id);

        if (!report) {
            return null
        }
        report.R_Feedback = feedback;
        report.R_Status = 'Processed'

        await report.save();

        return true
    } catch (error) {
        console.error('Error change report', error);
        return null;
    }
}

const deleteReport = async (id) => {
    try {

        const deletedReport = await db.Reports.destroy({
            where: {
                R_Id: id
            }
        });
        return deletedReport ? true : false;
    } catch (error) {
        console.error('Error deleting report', error);
        return null;
    }
}


module.exports = {
    findAllUsers,
    lockUser,
    unlockUser,
    deleteUser,
    findAllManagers,
    lockManager,
    unlockManager,
    deleteManager,

    findAllStores,
    lockStore,
    unlocStore,
    deleteStore,

    findAllReports,
    changeStatusReport,
    deleteReport
}

