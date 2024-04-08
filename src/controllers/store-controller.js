import storeServices from '../services/store-services'
import createResponse from '../helpers/responseHelper';
import userServices from '../services/user-services'
import imageServices from '../services/image-services'

//--------------------------------------------- Tìm kiếm, lấy thông tin chung----------------------------------------------//
const getStatusCoffeeStoreById = async (req, res) => {        // Xem cửa hàng có bị khóa hay không

    const id = req.params.id;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findCoffeeStoreById(id)
        if (newRecord) {
            if (newRecord.CS_Status === 'Normal') {
                return res.status(200).json(createResponse(0, 'Cửa hàng hoạt động bình thường',));
            } else {
                return res.status(200).json(createResponse(1, 'Cửa hàng bị khóa',));
            }
        } else {
            return res.status(200).json(createResponse(2, 'Không tìm thấy cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm cửa hàng theo id', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm cửa hàng theo id'));
    }
}

const getCoffeeStoresByName = async (req, res) => {           //  Tìm kiếm cửa hàng theo tên

    const name = req.query.store_name;

    try {
        if (!name) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập tên cửa hàng cần tìm'));
        }
        let newRecord = await storeServices.findAllCoffeeStoreByName(name)
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy cửa hàng danh sách cửa hàng', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy cửa hàng nào'));
        }
    } catch (error) {
        console.log('Lỗi tìm cửa hàng theo tên', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm cửa hàng theo tên'));
    }
}

const getCoffeeStoreById = async (req, res) => {              // Lấy thông tin chi tiết về cửa hàng

    const id = req.params.id;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findCoffeeStoreById(id)
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy cửa hàng', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm cửa hàng theo id', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm cửa hàng theo id'));
    }
}

const getDetailCoffeeStoreById = async (req, res) => {         // Lấy phần mô tả của cửa hàng 
    const { CS_Id: id } = req.query;

    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findCoffeeStoreDetailById(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy chi tiết giới thiệu', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy chi tiết giới thiệu'));
        }
    } catch (error) {
        console.log('Lỗi tìm trang giới thiệu cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm trang giới thiệu cửa hàng'));
    }
}

const getMenusCoffeeStoreById = async (req, res) => {           // Lấy menus cửa hàng
    const { CS_Id: id } = req.query;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findMenusByCoffeeStoreId(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy menu', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy menu'));
        }
    } catch (error) {
        console.log('Lỗi tìm menu cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm menu cửa hàng'));
    }
}

const getServicesCoffeeStoreById = async (req, res) => {        // Lấy dịch vụ cửa hàng cung cấp

    const { CS_Id: id } = req.query;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findServicesByCoffeeStoreId(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách services', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy services'));
        }
    } catch (error) {
        console.log('Lỗi tìm dịch vụ cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm dịch vụ cửa hàng'));
    }
}

const getHolidaysCoffeeStore = async (req, res) => {              // Lấy danh sách ngày nghỉ
    try {
        const month = req.query.AS_Holiday;

        const listHoliday = await storeServices.findAllHolidayToMonth(month);

        if (listHoliday) {
            return res.status(200).json(createResponse(0, 'Lấy danh sách ngày nghĩ thành công', listHoliday));
        }
        return res.status(200).json(createResponse(-1, 'Lấy danh sách ngày nghĩ không thành công', null));

    } catch (error) {
        console.error('Lỗi tìm kiếm danh sách ngày nghĩ', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm kiếm danh sách ngày nghĩ', null));
    }
};

const getCommentCoffeeStore = async (req, res) => {             // Lấy danh sách bình luận
    const { CS_Id: id } = req.query;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findAllCommentsOfStore(id);
        if (newRecord) {
            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách bình luận của cửa hàng', newRecord));
        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy danh sách bình luận của cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm bình luận cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm bình luận của cửa hàng'));
    }
}

const getRatingCoffeeStore = async (req, res) => {              // Lấy đánh giá
    const { CS_Id: id } = req.query;
    try {
        if (!id) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await storeServices.findAllCommentsOfStore(id);
        if (newRecord) {
            if (!Array.isArray(newRecord) || newRecord.length === 0) {
                return res.status(200).json(createResponse(0, 'Tìm thấy chi tiết đánh giá của cửa hàng', { averageRating, ratingCount }));
            }
            const totalStars = newRecord.reduce((acc, comment) => acc + comment.dataValues.C_StarsNumber, 0);
            const ratingCount = newRecord.length;
            const averageRating = totalStars / ratingCount;
            return res.status(200).json(createResponse(0, 'Tìm thấy chi tiết đánh giá của cửa hàng', { averageRating, ratingCount }));

        } else {
            return res.status(200).json(createResponse(1, 'Không tìm thấy chi tiết sách đánh giá của cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm chi tiết đánh giá cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm chi tiết đánh giá của cửa hàng'));
    }
}

const getAvatarCoffeeStore = async (req, res) => {              // Lấy ảnh đại điện
    const { CS_Id: coffeeStoreId } = req.query;

    try {
        if (!coffeeStoreId) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await imageServices.getImageUrl(`CS_${coffeeStoreId}_`);

        if (newRecord) {

            return res.status(200).json(createResponse(0, 'Tìm thấy ảnh đại diện của cửa hàng', newRecord));

        } else {
            return res.status(200).json(createResponse(1, 'Không tìm ảnh đại diện  của cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm ảnh đại diện  của cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm ảnh đại diện  của cửa hàng'));
    }
}

const getBannerCofeeStore = async (req, res) => {               // Lấy danh sách ảnh nề
    const { CS_Id: coffeeStoreId } = req.query;

    try {
        if (!coffeeStoreId) {
            return res.status(200).json(createResponse(-1, 'Vui lòng nhập ID cửa hàng'));
        }
        let newRecord = await imageServices.getImageUrls(`CS_${coffeeStoreId}_`);

        if (newRecord) {

            return res.status(200).json(createResponse(0, 'Tìm thấy danh sách ảnh của cửa hàng', newRecord));

        } else {
            return res.status(200).json(createResponse(1, 'Không tìm danh sách ảnh của cửa hàng'));
        }
    } catch (error) {
        console.log('Lỗi tìm ảnh của cửa hàng', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tìm ảnh của cửa hàng'));
    }
}

const getTagsCoffeeStoreById = async (req, res) => {            // 

}

//--------------------------------------------------  Với khách vãng lai

const checkTimeBooking = async (req, res) => {
    try {
        const { RT_DateTimeArrival: bookingDate, CS_Id: storeID, RT_Ip: RT_Ip } = req.body;

        if (!bookingDate || !storeID || !RT_Ip) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu kiểm tra thời gian đặt bàn không đủ với không tài khoản', null));
        }

        const IdBooking = await userServices.findLatestReserveTicketByIp(RT_Ip);
        // console.log('IdBooking ,  RT_Ip', IdBooking, RT_Ip);
        if (IdBooking) {
            const ReserveTicket = await userServices.findReserveTicketById(IdBooking);
            const statusReserveTicket = await userServices.findLatestStatusByReserveTicketId(IdBooking);
            const timecome = userServices.isTimeComeOfReserveTickeIsToday(ReserveTicket.RT_DateTimeArrival);
            // console.log(ReserveTicket, statusReserveTicket, timecome);
            if ((statusReserveTicket.SRT_Describe === 'Late' || statusReserveTicket.SRT_Describe === 'Waiting') && timecome) {
                return res.status(200).json(createResponse(2, `Bạn đã đặt 1 bàn ${ReserveTicket.RT_DateTimeArrival}`, ReserveTicket.RT_DateTimeArrival));
            } else {
                return res.status(200).json(createResponse(0, `Có thể đặt bàn`, null));
            }
        } else {
            return res.status(200).json(createResponse(0, `Bạn chưa đặt bàn lần nào`));
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra thời gian đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi khi kiểm tra thời gian đặt bàn', null));
    }
}

const createReserveTicketNoAccount = async (req, res) => {      // Tạo vé đặt cho khách ko tài khoản
    try {
        const { RT_DateTimeArrival: bookingDate, CS_Id: storeID, RT_Ip: ip, RT_NumberOfParticipants: numberOfParticipants } = req.body;

        // console.log(userID, bookingDate, storeID);

        if (!bookingDate || !storeID || !numberOfParticipants || !ip) {
            return res.status(201).json(createResponse(-1, 'Dữ liệu phiếu đặt bàn không đủ', null));
        }

        const IdBooking = await userServices.findLatestReserveTicketByIp(ip);

        if (IdBooking) {
            let reserveTicket = await userServices.findLatestStatusByReserveTicketId(IdBooking);
            let timecome = await userServices.isTimeComeOfReserveTickeIsToday(reserveTicket.createdAt)
            if (reserveTicket.SRT_Describe === 'Waiting' && timecome) {
                return res.status(200).json(createResponse(1, 'Bạn đã đặt 1 bàn trong hôm nay', null));
            }
        }

        const newRecord = await userServices.createReserveTicket(bookingDate, numberOfParticipants, ip, null, +storeID);
        if (newRecord) {
            const ID_lastBokking = await userServices.findLatestReserveTicketByIp(ip);
            userServices.createStatusReserveTicket(ID_lastBokking, 'Waiting');
            const qr = await userServices.createQrCode({ RT_Id: ID_lastBokking });
            return res.status(200).json(createResponse(0, 'Bạn đã đặt bàn thành công', qr));
        } else {
            return res.status(200).json(createResponse(-1, 'Đặt bàn không thành công', null));
        }

    } catch (error) {
        console.error('Lỗi tạo vé đặt bàn', error);
        return res.status(500).json(createResponse(-5, 'Lỗi tạo vé đặt bàn', null));
    }
};



module.exports = {
    getStatusCoffeeStoreById,
    getCoffeeStoresByName,
    getCoffeeStoreById,
    getDetailCoffeeStoreById,
    getMenusCoffeeStoreById,
    getServicesCoffeeStoreById,
    getTagsCoffeeStoreById,
    getHolidaysCoffeeStore,
    getCommentCoffeeStore,
    getRatingCoffeeStore,
    getBannerCofeeStore,
    getAvatarCoffeeStore,


    checkTimeBooking,
    createReserveTicketNoAccount,
}