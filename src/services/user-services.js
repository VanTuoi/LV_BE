const { Op, literal, where } = require('sequelize');
const QRCode = require('qrcode')
import db from "../models/index";
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
//----------------------------------------------Password--------------------------
const handlehashPassword = async (password) => {
    let hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword;
};

// ---------------------------------------------Account------------------------------------------------------//
const findUserById = async (id) => {
    try {
        const user = await db.User.findByPk(id)
        return user;
    } catch (error) {
        console.error('Error finding user details:', error);
        return null;
    }
};

const findUserByReserveTicketId = async (id) => {
    try {
        const user = await db.Reserve_Ticket.findByPk(id, {
            include: {
                model: db.User
            }
        });
        return user ? user : null;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
};

const findExpUserById = async (id) => {
    try {
        const user = await db.User.findByPk(id)
        return user && user.U_PrestigeScore ? user.U_PrestigeScore : null;
    } catch (error) {
        console.error('Error finding user details:', error);
        return null;
    }
};

const findAvatarbyId = async (id) => {
    try {
        const user = await db.User.findByPk(id)
        return user.U_Avatar ? user.U_Avatar : null;
    } catch (error) {
        console.error('Error finding avatar user :', error);
        return null;
    }
};

const getMaxTimeDelay = async (id) => {

    try {
        const user = await db.User.findByPk(id)
        if (user) {
            let currentExp = user.U_PrestigeScore;
            if (currentExp < 0) {
                return 0
            } else if (currentExp <= 5) {
                return 10
            } else if (currentExp <= 10) {
                return 20
            } else if (currentExp <= 30) {
                return 30
            } else if (currentExp <= 50) {
                return 45
            } else {
                return 60
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error finding user details:', error);
        return null;
    }
};

const updateInforUser = async (id, name, phone, email, gender, birthday, specialRequirements) => {
    try {
        const user = await db.User.findByPk(id);

        if (!user) {
            console.error('User not found');
            return null;
        }
        user.U_Name = name;
        user.U_PhoneNumber = phone;
        user.U_Email = email;
        user.U_Gender = gender;
        user.U_Birthday = birthday;
        user.U_SpecialRequirements = specialRequirements;

        await user.save(); // Save the changes to the database
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

const changePasswordUser = async (id, newPassword) => {
    try {

        let passwordHash = await handlehashPassword(newPassword)

        const user = await db.User.findByPk(id);

        if (!user) {
            console.error('User not found');
            return null;
        }
        user.U_Password = passwordHash;

        await user.save(); // Save the changes to the database
        return user;
    } catch (error) {
        console.error('Error updating passwrod user:', error);
        return null;
    }
};

const changeAvatarbyId = async (id, newAvatar) => {
    try {

        const user = await db.User.findByPk(id);

        if (!user) {
            console.error('User not found');
            return null;
        }
        user.U_Avatar = newAvatar;

        await user.save(); // Save the changes to the database
        return user;
    } catch (error) {
        console.error('Error finding change avatar', error);
        return null;
    }
};

const changeExp = async (id, value) => {
    const t = await db.sequelize.transaction(); // Bắt đầu một giao dịch mới

    try {
        // Tìm người dùng với khóa chính và áp dụng khóa Pessimistic trong quá trình giao dịch
        const user = await db.User.findByPk(id, { lock: t.LOCK.UPDATE, transaction: t });

        if (!user) {
            console.error('User not found');
            await t.rollback(); // Rollback giao dịch nếu không tìm thấy người dùng
            return null;
        }

        if (isNaN(value)) {
            console.error('Invalid value');
            await t.rollback(); // Rollback giao dịch nếu giá trị không hợp lệ
            return null;
        }

        // Cập nhật điểm uy tín
        user.U_PrestigeScore += Number(value);
        if (user.U_PrestigeScore < 0) {
            user.U_PrestigeScore = 0;
        }

        await user.save({ transaction: t }); // Lưu thay đổi với giao dịch
        await t.commit(); // Commit giao dịch khi mọi thứ thành công

        return user;
    } catch (error) {
        await t.rollback(); // Rollback giao dịch nếu có lỗi xảy ra
        console.error('Error updating exp user:', error);
        return null;
    }
};

// ---------------------------------------------Booking ---------------------------------------------------------//
const checkTimeReserveTicket = async (Reserve_Ticket_ID) => {
    try {
        let record = await findReserveTicketById(Reserve_Ticket_ID)
        if (record) {
            let timeArrival = new Date(record.RT_DateTimeArrival)
            const currentTime = new Date();
            const timeDifference = timeArrival.getTime() - currentTime.getTime();
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            // console.log('timeDifferenceInMinutes', timeDifferenceInMinutes);
            return timeDifferenceInMinutes
        } else {
            return null
        }

    } catch (error) {
        console.error('Error check time ticket:', error);
        return null;
    }
}

const checkBookingConditionHaveAccount = async (bookingTime, userId, storeId) => {
    try {
        const startTime = new Date(bookingTime - (1 * 60 * 60 * 1000 + 59 * 60 * 1000));
        const endTime = new Date(bookingTime + (1 * 60 * 60 * 1000 + 59 * 60 * 1000));

        // Tìm xem có bất kỳ đặt bàn nào trong khoảng thời gian từ startTime đến endTime không, kèm theo trạng thái
        const bookings = await db.Reserve_Ticket.findAll({
            where: {
                U_Id: userId,
                CS_Id: storeId,
                RT_DateTimeArrival: {
                    [Op.between]: [startTime, endTime]
                }
            },
            include: [{
                model: db.Status_Reserve_Ticket,
                as: 'Status_Reserve_Tickets', // Sử dụng bí danh chính xác như đã định nghĩa trong quan hệ
                order: [['createdAt', 'DESC']],
                limit: 1,
                attributes: ['SRT_Describe'], // Chỉ lấy trường 'SRT_Describe'
            }],
        });

        // console.log('bookings', bookings);
        let count = 0;
        if (bookings.length > 0) {
            for (const booking of bookings) {
                const bookingStatus = booking.Status_Reserve_Tickets ? booking.Status_Reserve_Tickets[0].SRT_Describe : null;
                if (bookingStatus === 'Waiting') {
                    return count++;
                }
            }
        }
        return count === 0;

    } catch (error) {
        console.error('Error checking booking condition with account', error);
        throw error;
    }
};

const isTimeComeOfReserveTickeIsToday = (date) => {
    const today = new Date(); // Lấy ngày hiện tại
    const inputDate = new Date(date);

    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const inputDateDate = inputDate.getDate();
    const inputDateMonth = inputDate.getMonth();
    const inputDateYear = inputDate.getFullYear();

    return (
        todayDate === inputDateDate &&
        todayMonth === inputDateMonth &&
        todayYear === inputDateYear
    );
};

const findLatestStatusByReserveTicketId = async (Reserve_Ticket_ID) => {
    try {
        const latestStatusRecord = await db.Status_Reserve_Ticket.findOne({
            where: { RT_Id: Reserve_Ticket_ID },
            order: [['createdAt', 'DESC']]
        });

        if (!latestStatusRecord) {
            console.log('No status found for the given ticket ID');
            return null;
        }

        const { SRT_Describe, createdAt, } = latestStatusRecord;
        return { SRT_Describe, createdAt };
    } catch (error) {
        console.error('Error finding the latest status record:', error);
        return null;
    }
};

const findTimeCreateLatestStatusByTicketId = async (Reserve_Ticket_ID) => {
    try {
        const latestStatusRecord = await db.Status_Reserve_Ticket.findOne({
            where: { RT_Id: Reserve_Ticket_ID },
            order: [['createdAt', 'DESC']] // Sắp xếp giảm dần dựa vào trường createdAt
        });
        // console.log('latestStatusRecord', latestStatusRecord);
        if (!latestStatusRecord) {
            console.log('No status found for the given ticket ID');
            return null;
        }

        return latestStatusRecord.dataValues.updatedAt;
    } catch (error) {
        console.error('Error finding the latest status record:', error);
        return null;
    }
};

const findReserveTicketById = async (Id) => {
    try {
        const bookingById = await db.Reserve_Ticket.findByPk(Id, {
            include: [{
                model: db.User,
                attributes: ['U_Name',]
            }]
        });
        return bookingById || null;
    } catch (error) {
        console.error('Error finding booking by ID:', error);
        throw error;
    }
};

const findLatestReserveTicketByIp = async (ip) => {
    try {
        const latestBookingField = await db.Reserve_Ticket.findOne({
            where: {
                RT_Ip: ip,
            },
            order: [['createdAt', 'DESC']], // Sắp xếp theo createdAt giảm dần
        });
        return latestBookingField ? latestBookingField.dataValues.RT_Id : null;
    } catch (error) {
        console.error('Error finding latest booking field by IP', error);
        throw error;
    }
};

const findAllReserveTicketByIdUser = async (id) => {
    try {
        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                U_Id: id,
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
                    let qrCode = await createQrCode({ RT_Id: item.RT_Id });
                    const Info = {
                        CS_Id: item.Coffee_Store.CS_Id,
                        RT_QrCode: qrCode,
                        RT_Id: item.RT_Id,
                        CS_Name: item.Coffee_Store.CS_Name,
                        CS_Avatar: item.Coffee_Store.CS_Avatar,
                        CS_Location: item.Coffee_Store.CS_Location,
                        RT_DateTimeArrival: item.RT_DateTimeArrival,
                        RT_NumberOfParticipants: item.RT_NumberOfParticipants,
                        SRT_Describe: item.Status_Reserve_Tickets[0].SRT_Describe,
                        RT_TimeCheckIn: item.Status_Reserve_Tickets[0].createdAt
                    };
                    list.push(Info);
                } catch (error) {
                    console.error('Error processing item:', error);
                }
            }
        }
        return list;
    } catch (error) {
        console.error('Error finding all booking field by Id', error);
        throw error;
    }
};

const findAllReserveTicketTodayByIdUser = async (id) => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const bookingField = await db.Reserve_Ticket.findAll({
            where: {
                U_Id: id,
                RT_DateTimeArrival: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
            order: [['createdAt', 'ASC']],
            attributes: ['RT_DateTimeArrival', 'RT_NumberOfParticipants'],
            include: [
                {
                    model: db.Status_Reserve_Ticket,
                    // where: { SRT_Describe: 'Waiting' },
                    attributes: ['SRT_Describe', 'createdAt'],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                },
                {
                    model: db.Coffee_Store,
                    attributes: ['CS_Id', 'CS_Name', 'CS_Location'],
                }
            ]
        });
        let list = []
        bookingField && bookingField.forEach((item) => {
            const Info = {
                CS_Id: item.Coffee_Store.CS_Id,
                CS_Name: item.Coffee_Store.CS_Name,
                CS_Location: item.Coffee_Store.CS_Location,
                RT_DateTimeArrival: item.RT_DateTimeArrival,
                RT_NumberOfParticipants: item.RT_NumberOfParticipants,
                SRT_Describe: item.Status_Reserve_Tickets[0].SRT_Describe,
            };
            list.push(Info);
        });
        return list;
    } catch (error) {
        console.error('Error finding all booking to day field by Id', error);
        throw error;
    }
};

const findLastReserveTicketId = async (userId, storeId) => {
    try {
        const lastBookingId = await db.Reserve_Ticket.max('RT_Id', {
            where: {
                U_Id: userId,
                CS_Id: storeId
            }
        });
        // console.log('Last booking ID:', lastBookingId);
        return lastBookingId || null;
    } catch (error) {
        console.error('Error finding last booking ID:', error);
        throw error;
    }
};

const createReserveTicket = async (bookingDate, numberOfParticipants, userIp, userId, storeId) => {
    try {
        const newRecord = await db.Reserve_Ticket.create({
            RT_DateTimeArrival: bookingDate,
            RT_NumberOfParticipants: numberOfParticipants,
            RT_Ip: userIp,
            U_Id: userId,
            CS_Id: storeId
        });
        return newRecord;
    } catch (error) {
        console.error('Error creating booking record:', error);
        throw error;
    }
};

const createStatusReserveTicket = async (Reserve_Ticket_ID, status) => {
    let transaction;

    try {
        // Bắt đầu một transaction
        transaction = await db.sequelize.transaction();

        const newRecord = await db.Status_Reserve_Ticket.create({
            RT_Id: Reserve_Ticket_ID,
            SRT_Describe: status,
        }, { transaction }); // Đảm bảo rằng việc tạo record mới được thực hiện trong một transaction

        // Nếu không có lỗi, commit transaction
        await transaction.commit();

        return newRecord.updatedAt;
    } catch (error) {
        // Nếu có lỗi xảy ra, rollback transaction
        if (transaction) await transaction.rollback();

        console.error('Error creating booking record:', error);
        return null;
    }
};

const createQrCode = (data) => {
    return new Promise((resolve, reject) => {
        let stringdata = JSON.stringify(data);
        // console.log('stringdata', stringdata);
        const options = {
            errorCorrectionLevel: 'H', // Mức độ sửa lỗi (L, M, Q, H)
            type: 'image/png', // Định dạng hình ảnh của mã QR
            quality: 1, // Chất lượng hình ảnh (0-1)
            margin: 1, // Khoảng cách lề (đơn vị: module)
            color: {
                dark: '#000000', // Màu cho phần module
                light: '#ffffff' // Màu cho phần nền
            },
            width: 350, // Kích thước của mã QR (đơn vị: pixel)
            height: 350
        };
        QRCode.toDataURL(stringdata, options, function (err, code) {
            if (err) {
                console.log('Error:', err);
                reject(err);
            } else {
                // console.log('QR Code:', code);
                resolve(code);
            }
        });
    });
};


//-----------------------------------Favorites Store--------------------------------------------------//
const findStatusFavoritesStore = async (idUser, isStore) => {
    try {
        const listSave = await db.Favorites_List.findOne({
            where: { U_Id: idUser, CS_Id: isStore },
        })
        return listSave ? true : false;
    } catch (error) {
        console.error(`Error finding a save store with id user ${idUser} and store is ${isStore}`, error);
        return null;
    }
};

const findStatusFavoritesAllStores = async (idUser) => {
    try {
        const favoriteStores = await db.Favorites_List.findAll({
            where: { U_Id: idUser },
            attributes: [],
            include: [{
                model: db.Coffee_Store,
                attributes: ['CS_Id', 'CS_Name', 'CS_Location', 'CS_Avatar'],
            }]
        });

        let list = []
        favoriteStores && favoriteStores.forEach((item) => {
            if (item.Coffee_Stores && item.Coffee_Stores.length > 0) {
                item.Coffee_Stores.forEach((coffeeStore) => {
                    const coffeeStoreInfo = {
                        CS_Id: coffeeStore.CS_Id,
                        CS_Name: coffeeStore.CS_Name,
                        CS_Location: coffeeStore.CS_Location,
                        CS_Avatar: coffeeStore.CS_Avatar
                    };
                    list.push(coffeeStoreInfo);
                });
            }
        });

        return list
    } catch (error) {
        console.error(`Error when searching favorite store list with user ID ${idUser}`, error);
        return null;
    }
};

const createFavoritesStore = async (idUser, isStore) => {
    try {
        const listSave = await db.Favorites_List.create({
            U_Id: idUser,
            CS_Id: isStore
        })
        // console.log(`Successfully save store with id user ${idUser} and store id ${isStore}.`);
        return listSave;
    } catch (error) {
        console.error(`Error create a save store with id user ${idUser} and store is ${isStore}`, error);
        return null;
    }
};

const deleteFavoritesStore = async (idUser, isStore) => {
    try {
        const result = await db.Favorites_List.destroy({
            where: {
                U_Id: idUser,
                CS_Id: isStore
            }
        });
        if (result === 0) {
            console.log(`No found store with id user ${idUser} and store id ${isStore} to delete.`);
            return false;
        }
        // console.log(`Successfully deleted save store with id user ${idUser} and store id ${isStore}.`);
        return true;
    } catch (error) {
        console.error(`Error deleting save store with id user ${idUser} and store id ${isStore}`, error);
        return false;
    }
};

// -------------------------------------Report------------------------------------------------------//
let findReport = async (U_Id, CS_Id) => {
    try {
        const newRecord = await db.Reports.findOne({
            where: {
                U_Id: U_Id,
                CS_Id: CS_Id
            }
        })
        return newRecord ? newRecord : null
    } catch (error) {
        console.error('Error find report record:', error);
    }
};

let findAllReportOfUser = async (U_Id) => {
    try {
        const reports = await db.Reports.findAll({
            where: {
                U_Id: U_Id,
            },
            include: [{
                model: db.Coffee_Store,
                attributes: ['CS_Name', 'CS_Avatar']
            }],
        });

        if (!reports) return null;

        const flattenedReports = reports.map((report) => {
            const reportJson = report.toJSON();

            return {
                ...reportJson,
                CS_Name: reportJson.Coffee_Store.CS_Name,
                CS_Avatar: reportJson.Coffee_Store.CS_Avatar,
            };
        });

        return flattenedReports;
    } catch (error) {
        console.error('Error find report record:', error);
        return null;
    }
};

let createReport = async (U_Id, CS_Id, detail) => {
    try {
        const newRecord = await db.Reports.create({
            R_Details: detail,
            R_Status: 'Pending',
            U_Id: U_Id,
            CS_Id: CS_Id
        })
        return newRecord ? true : null
    } catch (error) {
        console.error('Error creating report record:', error);
    }
};

const updateReport = async (id, detail) => {
    try {
        const report = await db.Reports.findByPk(id);

        if (!report) {
            return null
        }

        report.R_Details = detail;

        await report.save();

        return true
    } catch (error) {
        console.error('Error change report', error);
        return null;
    }
};

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
};


module.exports = {
    // Account
    findUserById,
    findUserByReserveTicketId,
    changeExp,
    getMaxTimeDelay,
    findExpUserById,
    updateInforUser,
    changePasswordUser,
    findAvatarbyId,
    changeAvatarbyId,

    // Booking
    checkBookingConditionHaveAccount,
    checkTimeReserveTicket,
    findLatestStatusByReserveTicketId,              // --> No account
    findTimeCreateLatestStatusByTicketId,           // --> No account
    isTimeComeOfReserveTickeIsToday,
    findLatestReserveTicketByIp,
    findLastReserveTicketId,
    findReserveTicketById,
    findAllReserveTicketByIdUser,
    findAllReserveTicketTodayByIdUser,
    createReserveTicket,
    createStatusReserveTicket,
    createQrCode,

    // Favorites 
    findStatusFavoritesStore,
    findStatusFavoritesAllStores,
    createFavoritesStore,
    deleteFavoritesStore,

    // Report
    findReport,
    findAllReportOfUser,
    createReport,
    updateReport,
    deleteReport
}
