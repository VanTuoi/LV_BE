import db from "../models/index";
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
//---------------------------------------------PW--------------------------
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
//---------------------------------------------Find-----------------------------------//
let findPhoneUser = async (phone) => {
    try {
        let havePhone = await db.User.findOne({
            where: { U_PhoneNumber: phone }
        })
        return havePhone ? true : false
    } catch (error) {
        console.log('Error find Phone user', error);
        return null
    }
}

let findPhoneManager = async (phone) => {
    try {
        let havePhone = await db.Manager.findOne({
            where: { M_PhoneNumber: phone }
        })
        return havePhone ? true : false
    } catch (error) {
        console.log('Error find Phone manager', error);
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

let findPasswordOfManagerByPhone = async (phone) => {
    try {
        let haveManager = await db.Manager.findOne({
            where: { M_PhoneNumber: phone },
            attributes: ['M_Password'],
        })
        // console.log('haveUser', haveUser);
        return haveManager ? haveManager : null
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

let findManagerByPhone = async (phone) => {
    try {
        let haveManager = await db.Manager.findOne({
            where: { M_PhoneNumber: phone },
            attributes: ['M_Id', 'M_Name'],
        })
        return haveManager ? haveManager : null
    } catch (e) {
        console.log(e)
        return null
    }
}

const findLatestStatusByUserId = async (id) => {
    try {
        const latestStatusRecord = await db.Status_User.findOne({
            where: { U_Id: id },
            order: [['createdAt', 'DESC']] // Sắp xếp giảm dần dựa vào trường createdAt
        });

        if (!latestStatusRecord) {
            console.log(`No status found for the given user ID  ${id}`);
            return null;
        }

        return latestStatusRecord.dataValues.SU_Describe;
    } catch (error) {
        console.error(`Error finding the latest status user record:  ${id}`, error);
        return null;
    }
};

const findLatestStatusByManagerId = async (id) => {
    try {
        const latestStatusRecord = await db.Status_Manager.findOne({
            where: { M_Id: id },
            order: [['createdAt', 'DESC']] // Sắp xếp giảm dần dựa vào trường createdAt
        });

        if (!latestStatusRecord) {
            console.log(`No status found for the given manager ID  ${id}`);
            return null;
        }

        return latestStatusRecord.dataValues.SM_Describe;
    } catch (error) {
        console.error(`Error finding the latest status manager record:  ${id}`, error);
        return null;
    }
};
//-------------------------------------------------------------Check have manager---------------//
const checkIsManager = async (id) => {

}

//--------------------------------------------------------- Create------------------------------//
let createUser = async (name, email, phone, password, gender, birthday, score) => {
    try {
        let passwordHash = await handlehashPassword(password)
        const newRecord = await db.User.create({
            U_Name: name,
            U_Password: passwordHash,
            U_PhoneNumber: phone,
            U_Gender: gender,
            U_Birthday: birthday,
            U_PrestigeScore: score,
        });
        // console.log('newRecord', newRecord);
        return newRecord;
    } catch (error) {
        console.log('Error create User', error);
        return null
    }
}
let createManager = async (name, email, phone, password, gender, birthday) => {
    try {
        let passwordHash = await handlehashPassword(password)

        const newRecord = await db.Manager.create({
            M_Name: name,
            M_Password: passwordHash,
            M_PhoneNumber: phone,
            M_Gender: gender,
            M_Birthday: birthday,
        });
        // console.log('newRecord', newRecord);
        return newRecord;
    } catch (error) {
        console.log('Error create manager', error);
        return null
    }
}
const createStatusUser = async (id, status) => {
    try {
        const newRecord = await db.Status_User.create({
            U_Id: id,
            SU_Describe: status,
        });
        return newRecord.updatedAt;
    } catch (error) {
        console.error('Error creating status user:', error);
        return null
    }
};
const createStatusManager = async (id, status) => {
    try {
        const newRecord = await db.Status_Manager.create({
            M_Id: id,
            SM_Describe: status,
        });
        return newRecord.updatedAt;
    } catch (error) {
        console.error('Error creating status manager:', error);
        return null
    }
};

module.exports = {
    //
    comparePassword,
    // Find
    findPhoneUser,
    findPhoneManager,
    findUserByPhone,
    findManagerByPhone,
    findPasswordOfUserByPhone,
    findPasswordOfManagerByPhone,
    findLatestStatusByUserId,
    findLatestStatusByManagerId,

    // Create
    createUser,
    createManager,
    createStatusUser,
    createStatusManager,
    // Update

}

