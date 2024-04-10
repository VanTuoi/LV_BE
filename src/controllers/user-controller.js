
import userServices from '../services/user-services'
import authenticationServices from '../services/authentication-services'
import createResponse from '../helpers/responseHelper';
import storeServices from '../services/store-services'

// --------------------------------------------Account----------------------------------------------------//

const getInfor = async (req, res) => {
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
        console.error('Lỗi khi tìm thông tin người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tìm thông tin người dùng', null));
    }
}

const updateInfor = async (req, res) => {
    try {
        const { U_Name: name, U_Id: id, U_Email: email, U_PhoneNumber: phone, U_Gender: gender, U_SpecialRequirements: specialRequirements, U_Birthday: birthday } = req.body;

        // console.log('', id, name, email, phone, gender, birthday);

        if (!name || !id || !email || !phone || !gender) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu cập nhật người dùng không đủ', null));
        }
        let haveUser = await userServices.findUserById(id)

        if (!haveUser) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy người dùng', null));
        }
        let user = await userServices.updateInforUser(id, name, phone, email, gender, birthday, specialRequirements)

        if (user) {
            return res.status(200).json(createResponse(0, 'Cập nhật thành công', user));
        }
        return res.status(200).json(createResponse(-3, 'Cập nhật thất bại', null));
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi cập nhật thông tin người dùng', null));
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
        console.error('Lỗi khi thay đổi mật khẩu thông tin người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi thay đổi mật khẩu thông tin người dùng', null));
    }
}

const getAvatar = async (req, res) => {
    try {
        const { U_Id: id, } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let user = await userServices.findAvatarbyId(id)

        if (!user) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy ảnh đại diện người dùng', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy ảnh đại diện người dùng', user));
    } catch (error) {
        console.error('Lỗi khi tìm ảnh đại diện người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tìm ảnh đại diện  người dùng', null));
    }
}

const getExp = async (req, res) => {
    try {
        const { U_Id: id, } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let expUser = await userServices.findExpUserById(id)

        if (!expUser) {
            return res.status(200).json(createResponse(-2, 'Không tìm thấy điểm uy tín người dùng', null));
        }

        return res.status(200).json(createResponse(0, 'Tìm thấy điểm uy tín người dùng', expUser));
    } catch (error) {
        console.error('Lỗi khi tìm điểm uy tín người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi tìm  điểm uy tín người dùng', null));
    }
}

const changeAvatar = async (req, res) => {
    try {
        const { U_Id: id, U_Avatar: avatar } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Không tìm thấy id', null));
        }
        let user = await userServices.changeAvatarbyId(id, avatar)

        if (!user) {
            return res.status(200).json(createResponse(-2, 'Không đổi được ảnh đại diện người dùng', user));
        }
        return res.status(200).json(createResponse(0, 'Đổi được ảnh đại diện người dùng thành công', null));
    } catch (error) {
        console.error('Lỗi khi đổi ảnh đại diện  người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi đổi ảnh đại diện  người dùng', null));
    }

}

// -------------------------------------------Booking ---------------------------------------------------------//
const checkTimeBooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID } = req.body;

        if ((!bookingDate || !storeID) || !userID) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu kiểm tra thời gian đặt bàn không đủ với có tài khoản', null));
        }

        const isValidBookingTime = await userServices.checkBookingConditionHaveAccount(+bookingDate, +userID, +storeID);
        if (isValidBookingTime) {
            return res.status(200).json(createResponse(0, 'Tìm thông tin đặt bàn thành công', null));
        }
        return res.status(200).json(createResponse(1, 'Bạn đã đặt trong khoảng thời gian gần đó', isValidBookingTime));
    } catch (error) {
        console.error('Lỗi khi kiểm tra thời gian đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi kiểm tra thời gian đặt bàn', null));
    }
};

const getReserveTicketsToday = async (req, res) => {
    try {
        const { U_Id: id } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu từ người dùng không đủ', null));
        }
        let list = await userServices.findAllReserveTicketTodayByIdUser(id)

        return res.status(200).json(createResponse(0, 'lấy danh sách đặt bàn hôm nay thành công', list));

    } catch (error) {
        console.error('Lỗi khi lấy tất cả thông tin đặt bàn trong hôm nay', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi lấy tất cả thông tin đặt bàn trong hôm nay', null));
    }
}

const getAllReserveTickets = async (req, res) => {
    try {
        const { U_Id: id } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu từ người dùng không đủ', null));
        }
        let list = await userServices.findAllReserveTicketByIdUser(id)

        return res.status(200).json(createResponse(0, 'lấy danh sách đặt bàn thành công', list));

    } catch (error) {
        console.error('Lỗi khi lấy tất cả thông tin đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi lấy tất cả thông tin đặt bàn', null));
    }
}

const checkStatusAllReserveTicketOfUser = async (req, res) => {     // Kiểm tra trạng thái các vé đặt bàn

    const { U_Id: userID, } = req.body;

    if (!userID) {
        console.log('Dữ liệu check trạng thái tất cả vé không đủ');
        return res.status(201).json(createResponse(-1, 'Dữ liệu check trạng thái tất cả vé không đủ', null));
    }
    try {

        const reserveTickets = await userServices.findAllReserveTicketByIdUser(userID)

        if (!reserveTickets) {
            console.log('Không tìm thấy danh sách vé đặt bàn của user');
            return res.status(201).json(createResponse(-1, 'Không tìm thấy danh sách vé đặt bàn của user', null));

        }
        for (const reserveTicket of reserveTickets) {
            const timeDifferenceInMinutes = await userServices.checkTimeReserveTicket(reserveTicket.RT_Id);
            const StatusByReserveTicket = await userServices.findLatestStatusByReserveTicketId(reserveTicket.RT_Id);
            const status = StatusByReserveTicket.SRT_Describe
            const maxTimeDelay = await userServices.getMaxTimeDelay(userID)

            function getCurrentTimeWithMilliseconds() {
                const now = new Date();
                const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
                const formattedDate = now.toLocaleDateString('en-US', options);
                const timeParts = now.toLocaleTimeString('en-US', { hour12: false }).split(':');
                const milliseconds = now.getMilliseconds().toString().padStart(4, '0');
                const timezone = now.toString().match(/\(([A-Za-z\s].*)\)/)[1];

                return `${formattedDate} ${timeParts[0]}:${timeParts[1]}:${timeParts[2].substring(0, 2)}.${milliseconds} ${timezone}`;
            }
            // console.log(`Kiểm tra vé đặt bàn có Id: ${reserveTicket.RT_Id} có trạng thái là : ${status} vào lúc ${getCurrentTimeWithMilliseconds()}`);

            if (status === 'Waiting' && timeDifferenceInMinutes <= maxTimeDelay) {
                await userServices.createStatusReserveTicket(reserveTicket.RT_Id, 'Late');
                await userServices.changeExp(userID, -2)                // Muộn thì -2
                console.log('Update status ReserveTicket');
            }
        }
        return res.status(201).json(createResponse(0, 'Duyệt lịch sử đặt bàn của người dùng thành công', null));
    } catch (error) {
        console.error('Lỗi khi duyệt lịch sử đặt bàn của người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi duyệt lịch sử đặt bàn của người dùng', null));

    }
};

const createReserveTicketHaveAccount = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, U_Id: userID, CS_Id: storeID, RT_NumberOfParticipants: numberOfParticipants } = req.body;

        // console.log(userID, bookingDate, storeID);

        if (!bookingDate || !storeID || !numberOfParticipants || !userID) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu phiếu đặt bàn không đủ', null));
        }

        const isValidBookingTime = await userServices.checkBookingConditionHaveAccount(bookingDate, +userID, +storeID);

        if (isValidBookingTime) {
            const newRecord = await userServices.createReserveTicket(bookingDate, numberOfParticipants, null, userID, storeID);
            if (newRecord) {
                const ID_lastBokking = await userServices.findLastReserveTicketId(userID, storeID);
                userServices.createStatusReserveTicket(ID_lastBokking, 'Waiting');
                const qr = await userServices.createQrCode({ RT_Id: ID_lastBokking });
                return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
            } else {
                return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
            }
        } else {
            return res.status(200).json(createResponse(-1, 'Bạn đã đặt 1 bàn đã đặt gần thời gian đó', null));
        }
    } catch (error) {
        console.error('Lỗi tạo vé đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tạo vé đặt bàn', null));
    }
};

//------------------------------------------ Store-------------------------------------------------------//
const statusFavouriteStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm trạng thái lưu cửa hàng từ người dùng không đủ', null));
        }

        let isSave = await userServices.findStatusFavoritesStore(id, CS_Id)

        if (isSave) {
            return res.status(200).json(createResponse(0, 'Đây là cửa hàng yêu thích của bạn'));
        } else {
            return res.status(200).json(createResponse(1, 'Đây không là cửa hàng yêu thích của bạn'));
        }

    } catch (error) {
        console.error('Lỗi lấy trạng thái cửa hàng yêu thích', error);
        return res.status(500).json(createResponse(-5, 'Lỗi lấy trạng thái cửa hàng yêu thích', null));
    }
}

const statusFavouriteAllStores = async (req, res) => {
    try {
        const { U_Id: id } = req.body;

        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm trạng thái lưu tất cả cửa hàng yêu thích từ người dùng không đủ', null));
        }

        let isHave = await userServices.findStatusFavoritesAllStores(id)

        if (isHave) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách lưu cửa hàng yêu thích', isHave));
        } else {
            return res.status(200).json(createResponse(1, 'Không thấy danh sách lưu cửa hàng yêu thích', null));
        }

    } catch (error) {
        console.error('Lỗi lấy trạng thái tất cả cửa hàng yêu thích', error);
        return res.status(500).json(createResponse(-5, 'Lỗi lấy trạng thái tất cả cửa hàng yêu thích', null));
    }
}

const getComment = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id, } = req.body;
        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm bình luận không đủ', null));
        }

        let isHave = await storeServices.findCommentOfCoffeeStoreByIdUser(id, CS_Id)

        if (isHave) {
            return res.status(200).json(createResponse(0, 'Tìm thấy bình luận của người dùng', isHave));
        }
        return res.status(200).json(createResponse(1, 'Không tìm thấy bình luận của người dùng', null));

    } catch (error) {
        console.error('Lỗi tìm bình luận của người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm bình luận của người dùng', null));
    }
}

const getReport = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id, } = req.body;
        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm báo cáo không đủ', null));
        }

        let isHave = await userServices.findReport(id, CS_Id)

        if (isHave) {
            return res.status(200).json(createResponse(0, 'Tìm thấy báo cáo của người dùng', true));
        }
        return res.status(200).json(createResponse(1, 'Không tìm thấy báo cáo của người dùng', null));

    } catch (error) {
        console.error('Lỗi tìm báo cáo của người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm báo cáo của người dùng', null));
    }
}

const getAllReports = async (req, res) => {
    try {
        const { U_Id: id, } = req.body;
        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu tìm danh sách báo cáo không đủ', null));
        }

        let isHave = await userServices.findAllReportOfUser(id)

        if (isHave) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách báo cáo của người dùng', isHave));
        }
        return res.status(200).json(createResponse(1, 'Không tìm thấy danh sách báo cáo của người dùng', null));

    } catch (error) {
        console.error('Lỗi tìm danh sách báo cáo của người dùng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm danh sách báo cáo của người dùng', null));
    }
}

const createFavouriteStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu lưu cửa hàng từ người dùng không đủ', null));
        }
        let isSave = await userServices.findStatusFavoritesStore(id, CS_Id)

        if (isSave) {
            return res.status(200).json(createResponse(-1, 'Bạn đã lưu cửa hàng yêu thích', null));
        }

        let createFavouriteStore = await userServices.createFavoritesStore(id, CS_Id)

        if (createFavouriteStore) {
            return res.status(200).json(createResponse(0, 'Lưu cửa hàng yêu thích thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Lưu cửa hàng yêu thích thất bại', null));
        }

    } catch (error) {
        console.error('Lỗi lưu cửa hàng yêu thích', error);
        return res.status(500).json(createResponse(-5, 'Lỗi lưu cửa hàng yêu thích', null));
    }
}

const createCommentOfUser = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id, C_Details: C_Details, C_StarsNumber: C_StarsNumber } = req.body;
        if (!id || !CS_Id || !C_StarsNumber) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu bình luận không đủ', null));
        }

        let status = await storeServices.createCommentOfUser(id, CS_Id, C_Details, C_StarsNumber)

        if (status) {
            return res.status(200).json(createResponse(0, 'Tạo bình luận thành công'));
        }
        return res.status(200).json(createResponse(1, 'Tạo bình luận thất bại', null));

    } catch (error) {
        console.error('Lỗi tạo bình luận', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tạo bình luận', null));
    }
}

const createReport = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id, R_Details: R_Details } = req.body;
        if (!id || !CS_Id || !R_Details) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu báo cáo không đủ', null));
        }

        let status = await userServices.createReport(id, CS_Id, R_Details)

        if (status) {
            return res.status(200).json(createResponse(0, 'Tạo báo cáo thành công'));
        }
        return res.status(200).json(createResponse(1, 'Tạo báo cáo thất bại', null));

    } catch (error) {
        console.error('Lỗi tạo báo cáo', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tạo báo cáo', null));
    }
}

const changeComment = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id, C_Details: C_Details, C_StarsNumber: C_StarsNumber } = req.body;
        if (!id || !CS_Id || !C_StarsNumber) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu thay đổi bình luận không đủ', null));
        }

        let status = await storeServices.updateCommentOfUser(id, CS_Id, C_Details, C_StarsNumber)

        if (status) {
            return res.status(200).json(createResponse(0, 'Thay đổi bình luận thành công'));
        }
        return res.status(200).json(createResponse(1, 'Thay đổi bình luận thất bại', null));

    } catch (error) {
        console.error('Lỗi thay đổi bình luận', error);
        return res.status(500).json(createResponse(-5, 'Lỗi thay đổi bình luận', null));
    }
}

const changeReport = async (req, res) => {
    try {
        const { R_Id: R_Id, R_Details: R_Detail } = req.body;

        if (!R_Id || !R_Detail) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu thay đổi báo cáo không đủ', null));
        }

        let status = await userServices.updateReport(R_Id, R_Detail)

        if (status) {
            return res.status(200).json(createResponse(0, 'Thay đổi báo cáo thành công'));
        }
        return res.status(200).json(createResponse(1, 'Thay đổi báo cáo thất bại', null));

    } catch (error) {
        console.error('Lỗi thay đổi báo cáo', error);
        return res.status(500).json(createResponse(-5, 'Lỗi thay đổi báo cáo', null));
    }
}

const deleteCommentOfUser = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;
        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu xóa bình luận không đủ', null));
        }

        let status = await storeServices.deleteCommentOfUser(id, CS_Id)

        if (status) {
            return res.status(200).json(createResponse(0, 'Xóa bình luận thành công'));
        }
        return res.status(200).json(createResponse(1, 'Xóa bình luận thất bại', null));

    } catch (error) {
        console.error('Lỗi xóa bình luận', error);
        return res.status(500).json(createResponse(-5, 'Lỗi xóa bình luận', null))
    }
}

const deleteFavouriteStore = async (req, res) => {
    try {
        const { U_Id: id, CS_Id: CS_Id } = req.body;

        if (!id || !CS_Id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu xóa Xóa cửa hàng yêu thích từ người dùng không đủ', null));
        }

        let isDeleteStore = await userServices.deleteFavoritesStore(id, CS_Id)

        if (isDeleteStore) {
            return res.status(200).json(createResponse(0, 'Xóa cửa hàng yêu thích thành công'));
        } else {
            return res.status(200).json(createResponse(1, 'Xóa cửa hàng yêu thích thất bại', null));
        }

    } catch (error) {
        console.error('Lỗi xóa cửa hàng yêu thích', error);
        return res.status(500).json(createResponse(-5, 'Lỗi xóa cửa hàng yêu thích', null));
    }
}

const deleteReport = async (req, res) => {
    try {
        const { R_Id: id } = req.body;
        if (!id) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu xóa báo cáo không đủ', null));
        }

        let status = await userServices.deleteReport(id)

        if (status) {
            return res.status(200).json(createResponse(0, 'Xóa báo cáo thành công'));
        }
        return res.status(200).json(createResponse(1, 'Xóa báo cáo thất bại', null));

    } catch (error) {
        console.error('Lỗi xóa báo cáo', error);
        return res.status(500).json(createResponse(-5, 'Lỗi xóa báo cáo', null));
    }
}

module.exports = {
    // Account
    getInfor,
    updateInfor,
    changePassword,
    getAvatar,
    getExp,
    changeAvatar,

    // Store
    statusFavouriteStore,
    statusFavouriteAllStores,
    checkTimeBooking,
    checkStatusAllReserveTicketOfUser,
    getComment,
    getReport,
    getAllReports,
    getReserveTicketsToday,
    getAllReserveTickets,
    createReserveTicketHaveAccount,
    createReport,
    createFavouriteStore,
    createCommentOfUser,
    changeReport,
    changeComment,
    deleteReport,
    deleteCommentOfUser,
    deleteFavouriteStore,

}
