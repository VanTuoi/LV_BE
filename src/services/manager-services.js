const { Op } = require('sequelize');
const QRCode = require('qrcode')
import db from "../models/index";
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
//-----------------------------------------Password--------------------------
const handlehashPassword = async (password) => {
    let hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword;
}
// -------------------------------------------------------------Account------------------------------------------------------//
const findManagerById = async (id) => {
    try {
        const manager = await db.Manager.findByPk(id)
        return manager;
    } catch (error) {
        console.error('Error finding manager details:', error);
        return null;
    }
};

const updateInforManager = async (id, name, phone, email, gender, birthday) => {
    try {
        const manager = await db.Manager.findByPk(id);

        if (!manager) {
            console.error('Manager not found');
            return null;
        }
        manager.M_Name = name;
        manager.M_PhoneNumber = phone;
        manager.M_Email = email;
        manager.M_Gender = gender;
        manager.M_Birthday = birthday;

        await manager.save(); // Save the changes to the database
        return manager;
    } catch (error) {
        console.error('Error updating manager:', error);
        return null;
    }
};

const changePassworManager = async (id, newPassword) => {
    try {

        let passwordHash = await handlehashPassword(newPassword)

        const manager = await db.Manager.findByPk(id);

        if (!manager) {
            console.error('Manager not found');
            return null;
        }
        manager.M_Password = passwordHash;

        await manager.save(); // Save the changes to the database
        return manager;
    } catch (error) {
        console.error('Error updating passwrod manager:', error);
        return null;
    }
};

module.exports = {
    // Account
    findManagerById,
    updateInforManager,
    changePassworManager,
}
