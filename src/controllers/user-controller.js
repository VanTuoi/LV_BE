const userServices = require('../services/user-services');


// ----------------------------------------Booking ---------------------------------------------------------//
const testAPI = async (req, res) => {
    let check = await userServices.createStatusBooking('1', 'Has Arrived')
    return res.status(200).send({ check })
}
const checkTimeABooking = async (req, res) => {
    try {
        let bookingDate = +req.body.RT_DateTimeArrival;
        let userID = +req.body.U_Id
        let storeID = +req.body.CS_Id
        // console.log('[1:', req.body.RT_DateTimeArrival, req.body.U_Id, req.body.CS_Id, ']');

        if (bookingDate && userID && storeID) {
            const isValidBookingTime = await userServices.checkBookingCondition(bookingDate, userID, storeID);
            return res.status(200).send({
                errorCode: '0',
                errorMessage: 'Tìm thông tin đặt bàn thành công',
                data: isValidBookingTime,
            });
        } else {
            return res.status(201).send({
                errorCode: '-1',
                errorMessage: 'Dữ liệu không không đủ',
                data: null
            });
        }

    }
    catch (err) {
        console.log('Error', err);
        return res.status(500).send({
            errorCode: '-5',
            errorMessage: 'Lỗi từ server',
            Data: null
        });
    }
}
const createABooking = async (req, res) => {
    try {

        let bookingDate = +req.body.RT_DateTimeArrival;
        let userID = +req.body.U_Id
        let storeID = +req.body.CS_Id
        let numberOfParticipants = +req.body.RT_NumberOfParticipants
        let ip = req.body.RT_Ip


        if (!userID && ip) {
            const IdBooking = await userServices.findBookingbyIp(ip)
            if (IdBooking) {
                let status = await userServices.findLatestStatusByTicketId(IdBooking);
                // console.log('status', status);
                if (status === 'Waiting') {
                    return res.status(200).send({
                        errorCode: '0',
                        errorMessage: 'Bạn đã đặt 1 bàn trước đó',
                        data: null,
                    });
                }
            }

            const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, ip, null, storeID);
            // console.log('newRecord', newRecord);
            if (newRecord) {

                const ID_lastBokking = await userServices.findBookingbyIp(ip);

                userServices.createStatusBooking(ID_lastBokking, 'Waiting')

                const qr = await userServices.createAQrCode({ CS_Id: ID_lastBokking });

                return res.status(200).send({
                    errorCode: '0',
                    errorMessage: 'Bạn đã đặt bàn thành công',
                    data: qr,
                });
            }
            else {
                return res.status(200).send({
                    errorCode: '-1',
                    errorMessage: 'Đặt bàn không thành công',
                    data: null
                });
            }

        }
        else {

            if (bookingDate && userID && storeID && numberOfParticipants) {

                const isValidBookingTime = await userServices.checkBookingCondition(bookingDate, userID, storeID);

                if (isValidBookingTime) {

                    const newRecord = await userServices.createBookingRecord(bookingDate, numberOfParticipants, null, userID, storeID);

                    if (newRecord) {

                        const ID_lastBokking = await userServices.findLastBookingId(userID, storeID);

                        userServices.createStatusBooking(ID_lastBokking, 'Waiting')

                        const qr = await userServices.createAQrCode({ CS_Id: ID_lastBokking });

                        return res.status(200).send({
                            errorCode: '0',
                            errorMessage: 'Bạn đã đặt bàn thành công',
                            data: qr,
                        });
                    }
                    else {
                        return res.status(200).send({
                            errorCode: '-1',
                            errorMessage: 'Đặt bàn không thành công',
                            data: null
                        });
                    }
                } else {
                    console.log('Bạn đã đặt 1 bàn đã đặt gần thời gian đó');

                    return res.status(200).send({
                        errorCode: '-1',
                        errorMessage: 'Bạn đã đặt 1 bàn đã đặt gần thời gian đó',
                        data: null
                    });
                }
            } else {
                return res.status(201).send({
                    errorCode: '-1',
                    errorMessage: 'Dữ liệu phiếu đặt bàn không đủ',
                    data: null
                });
            }
        }

    } catch (err) {
        console.log('Error', err);

        return res.status(500).send({
            errorCode: '-5',
            errorMessage: 'Lỗi từ server',
            Data: null
        });
    }
}

const createAccount = async (req, res) => {
    let userId = req.query.id;
    console.log('run user id', req.query);
    if (userId != null) {
        console.log('Cookies: ', req.cookies)

        // Cookies that have been signed
        console.log('Signed Cookies: ', req.signedCookies)

        // let userData = await userServices.getUsers(userId);
        return res.send(userData);
    } else {
        return res.send('data not found')
    };
}


module.exports = {
    createAccount, createABooking, checkTimeABooking, testAPI
}
