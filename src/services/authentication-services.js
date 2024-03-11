import db from "../models/index";
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
const handlehashPassword = async (password) => {
    let hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword;
}

const comparePassword = async (inputPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

let findPhone = async (phone) => {
    try {
        let havePhone = await db.User.findOne({
            where: { U_PhoneNumber: phone }
        })
        return havePhone ? true : false
    } catch (error) {
        console.log('Error find Phone', error);
        return null
    }
}

let createUser = async (name, email, phone, password, gender, birthday, score) => {
    try {

        let passwordHash = await handlehashPassword(password)

        const newRecord = await db.User.create({
            U_Name: name,
            U_Password: passwordHash,
            U_PhoneNumber: phone,
            U_Gender: gender,
            U_Birthday: birthday,
            U_DateOpening: null,
            U_PrestigeScore: score,
        });
        // console.log('newRecord', newRecord);
        return newRecord;
    } catch (error) {
        console.log('Error create User', error);
        return null
    }
}

let findPasswordOfUserByPhone = async (phone) => {
    try {
        let haveUser = await db.User.findOne({
            where: { U_PhoneNumber: phone },
            attributes: ['U_Password'],
        })
        // console.log('haveUser', haveUser);
        return haveUser ? haveUser : null
    } catch (e) {
        console.log(e)
        return null
    }
}

let findUserByPhone = async (phone) => {
    try {
        let haveUser = await db.User.findOne({
            where: { U_PhoneNumber: phone },
            attributes: ['U_Id', 'U_Name', 'U_PrestigeScore'],
        })
        return haveUser ? haveUser : null
    } catch (e) {
        console.log(e)
        return null
    }
}

module.exports = {
    findPhone, createUser, findUserByPhone, comparePassword, findPasswordOfUserByPhone
}

