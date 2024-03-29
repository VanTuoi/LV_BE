const userServices = require('../services/user-services');
const authenticationServices = require('../services/authentication-services');
import createResponse from '../helpers/responseHelper';

// ----------------------------------------Booking ---------------------------------------------------------//
const testAPI = async (req, res) => {
    let check = await userServices.createStatusBooking('1', 'Has Arrived')
    return res.status(200).send({ check })
}
const checkTimeABooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID, RT_Ip: RT_Ip } = req.body;

        if ((!bookingDate || !storeID) || (!userID && !RT_Ip)) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu check time không đủ', null));
        }

        const isValidBookingTime = await userServices.checkBookingCondition(+bookingDate, +userID, RT_Ip, +storeID);
        if (isValidBookingTime) {
            return res.status(200).json(createResponse(0, 'Tìm thông tin đặt bàn thành công', null));
        }
        return res.status(200).json(createResponse(1, 'Bạn đã đặt trong khoảng thời gian gần đó', isValidBookingTime));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};
const createABooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID, RT_NumberOfParticipants: numberOfParticipants, RT_Ip: ip } = req.body;

        console.log(userID, bookingDate, storeID);

        if (!bookingDate || !storeID || !numberOfParticipants) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu phiếu đặt bàn không đủ', null));
        }

        if (!userID && ip) {
            const IdBooking = await userServices.findBookingbyIp(ip);
            if (IdBooking) {
                let status = await userServices.findLatestStatusByTicketId(IdBooking);
                if (status === 'Waiting') {
                    return res.status(200).json(createResponse(0, 'Bạn đã đặt 1 bàn trước đó', null));
                }
            }

            const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, ip, null, +storeID);
            if (newRecord) {
                const ID_lastBokking = await userServices.findBookingbyIp(ip);
                userServices.createStatusBooking(ID_lastBokking, 'Waiting');
                const qr = await userServices.createQrCode({ RT_Id: ID_lastBokking });
                return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
            } else {
                return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
            }
        }

        const isValidBookingTime = await userServices.checkBookingCondition(bookingDate, +userID, ip, +storeID);

        if (isValidBookingTime) {
            const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, null, userID, storeID);
            if (newRecord) {
                const ID_lastBokking = await userServices.findLastBookingId(userID, storeID);
                userServices.createStatusBooking(ID_lastBokking, 'Waiting');
                const qr = await userServices.createQrCode({ RT_Id: ID_lastBokking });
                return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
            } else {
                return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
            }
        } else {
            return res.status(200).json(createResponse(-1, 'Bạn đã đặt 1 bàn đã đặt gần thời gian đó', null));
        }
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
};
const getAllBooking = async (req, res) => {
    try {
        const { U_Id: id } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu từ người dùng không đủ', null));
        }
        let list = await userServices.findAllBookingbyIdUser(id)

        return res.status(200).json(createResponse(0, 'lấy danh sách booking thành công', list));

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
// ----------------------------------------manager info----------------------------------------------------//

const getInforUser = async (req, res) => {
    try {
        const { U_Id: id, } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let user = await userServices.findUserById(id)

        if (!user) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }
        return res.status(200).json(createResponse(0, 'Tìm thấy người dùng', user));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
const updateInfo = async (req, res) => {
    try {
        const { U_Name: name, U_Id: id, U_Email: email, U_PhoneNumber: phone, U_Gender: gender, U_SpecialRequirements: specialRequirements, U_Birthday: birthday } = req.body;

        // console.log('', id, name, email, phone, gender, birthday);

        if (!name || !id || !email || !phone || !gender || !specialRequirements) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu cập nhật người dùng không đủ', null));
        }
        let haveUser = await userServices.findUserById(id)

        if (!haveUser) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }
        let user = await userServices.updateInfoUser(id, name, phone, email, gender, birthday, specialRequirements)

        if (user) {
            return res.status(200).json(createResponse(0, 'Cập nhật thành công', user));
        }
        return res.status(200).json(createResponse(-3, 'Cập nhật thất bại', null));
    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
const changePassword = async (req, res) => {
    try {
        const { U_Id: id, U_Current_Password: currenPassword, U_New_Password: newPassword } = req.body;

        if (!id || !newPassword || !currenPassword) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu đổi mật khẩu người dùng không đủ', null));
        }
        let haveUser = await userServices.findUserById(id)

        if (!haveUser) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }

        let checkPassword = await authenticationServices.comparePassword(currenPassword, haveUser.U_Password)

        if (checkPassword) {
            userServices.changePasswordUser(id, newPassword)
            return res.status(200).json(createResponse(0, 'Cập nhật mật khẩu thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Mật khẩu hiện tại của bạn không chính xác', null));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}

//-------------------------------------------Store-------------------------------------------------------//
const statusSaveStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm trạng thái lưu cửa hàng từ người dùng không đủ', null));
        }

        let isSave = await userServices.findStatusSaveStore(id, CS_Id)

        if (isSave) {
            return res.status(200).json(createResponse(0, 'Đây là cửa hàng yêu thích của bạn'));
        } else {
            return res.status(200).json(createResponse(1, 'Đây không là cửa hàng yêu thích của bạn'));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
const statusSaveAllStore = async (req, res) => {
    try {
        const { U_Id: id } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm trạng thái lưu cửa hàng từ người dùng không đủ', null));
        }

        let isHave = await userServices.findStatusSaveAllStore(id)

        if (isHave) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách lưu cửa hàng', isHave));
        } else {
            return res.status(200).json(createResponse(1, 'Không thấy danh sách lưu cửa hàng', null));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
const saveStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu lưu cửa hàng từ người dùng không đủ', null));
        }
        let isSave = await userServices.findStatusSaveStore(id, CS_Id)

        if (isSave) {
            return res.status(200).json(createResponse(-1, 'Bạn đã lưu', null));
        }

        let saveStore = await userServices.createSaveStore(id, CS_Id)

        if (saveStore) {
            return res.status(200).json(createResponse(0, 'Lưu thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Lưu cửa hàng thất bại', null));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}
const deleteStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu lưu cửa hàng từ người dùng không đủ', null));
        }

        let isDeleteStore = await userServices.deleteSaveStore(id, CS_Id)

        if (isDeleteStore) {
            return res.status(200).json(createResponse(0, 'Lưu thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Lưu cửa hàng thất bại', null));
        }

    } catch (error) {
        console.error('Lỗi từ server:', error);
        return res.status(500).json(createResponse(-5, 'Lỗi từ server', null));
    }
}





module.exports = {
    checkTimeABooking,
    createABooking,

    getInforUser,
    updateInfo,
    changePassword,
    testAPI,
    statusSaveAllStore,
    getAllBooking,
    saveStore, statusSaveStore, deleteStore
}
