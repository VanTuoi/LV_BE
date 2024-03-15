import db from "../models/index";
const { Op } = require('sequelize');
const QRCode = require('qrcode')

let findBokingScheduleToMonth = async (month, id) => {
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
        console.error('Error finding Reserve_Ticket records:', error);
        return null
    }
}
let getHoliday = async (month) => {
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
        console.error('Error getting vacation list:', error);
        return [];
    }
}
let setVacationListServices = async (AS_Holiday, CS_Id) => {
    try {
        const maxTimeDifference = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        // Find the last booking time
        const lastBookingTime = await db.Reserve_Ticket.max('RT_DateTimeArrival');

        // Check condition: New booking time must be at least 2 hours later than the last booking time and not earlier than the current time
        if (true) {
            // Check if the combination of AS_Holiday and CS_Id already exists in the database
            const existingRecord = await db.Activity_Schedule.findOne({
                where: {
                    AS_Holiday: AS_Holiday,
                    CS_Id: CS_Id
                }
            });

            if (existingRecord) {
                console.log('Duplicate record exists.');
                return '2'; // Return code for duplicate record
            } else {
                // Create a new record if condition is met
                const newRecord = await db.Activity_Schedule.create({
                    AS_Holiday: AS_Holiday,
                    CS_Id: CS_Id
                });
                return '0'; // Return code for success
            }
        } else {
            // If condition is not met, handle error or invalid booking
            console.log('Invalid booking time.');
            return '1'; // Return code for invalid booking
        }
    } catch (error) {
        console.error('Error creating or checkIng Activity_Schedule record:', error);
    }
}

//---------------------------------------------------Manager coffee store------------------------------------------------------------//

module.exports = {
    findBokingScheduleToMonth, getHoliday, setVacationListServices,
}
