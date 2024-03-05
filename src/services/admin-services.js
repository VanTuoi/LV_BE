import db from "../models/index";
import { creatJWT } from '../middleware/authentication'
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);
const handlehashPassword = (password) => {
    let hashPassword = bcrypt.hashSync(password, salt)
    return hashPassword;
}

let getUsers = async (userId) => {
    try {
        let newuser = await db.User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'email'],
            include: {
                model: db.Group,
                attributes: ['id', 'name'],
            },

            raw: true,
            nest: true,
        })

        // let r = await db.Role.findAll({
        //     include: { model: db.Group, where: { id: 1 } },
        //     attributes: ['id', 'name', 'email'],
        //     raw: true,
        //     nest: true
        // })
        if (newuser) {
            console.log('check new user', newuser);

            // Cookies that have not been signed
            return newuser
        }
        else {
            console.log('not find user');
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

let createUserServices = async (userInfo) => {
    // console.log('hehe')
    // return true
    try {
        await db.User.create({
            email: '123@',
            password: '123',
            username: 'van tuoi 4',
        })
        return true
    } catch (e) {
        console.log("error", e);
        return false
    }
}
let checkEmail = async (email) => {
    let check = await db.User.findOne({
        where: { email: email }
    })
    return check
}

let registerUser = async (data) => {
    try {
        let check = await checkEmail(data.email)
        if (check) {
            return {
                EM: 'Email is already exist',
                EC: 1,
                DT: '',
            }
        } else {
            let hashPassword = handlehashPassword(data.password);
            await db.User.create({
                email: data.email,
                username: data.username,
                password: hashPassword,
            })
            return {
                EM: 'Register is success !',
                EC: 0,
                DT: '',
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Somthing wrongs in services',
            EC: 2,
            DT: '',
        }
    }
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
function delayOnServer(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
let login = async (data) => {
    try {

        let account = await db.User.findOne({
            where: { email: data.email },
        })
        let jwt = null
        if (!account) {
            return {
                // EM: 'Account does not exist',
                EM: 'Không tìm thấy tài khoản !',
                EC: 1,
                DT: {
                    jwt
                },
            }
        } else {
            let check = await comparePassword(data.password, account.password);
            // let b = await delayOnServer(5000);                                      // test hàm delay
            if (check) {
                jwt = await creatJWT(data.email);
                return {
                    EM: 'login is success !',
                    EC: 0,
                    DT: {
                        jwt
                    },
                }
            } else {
                return {
                    // EM: 'incorrect password',
                    EM: 'Mật khẩu không đúng !',
                    EC: 2,
                    DT: {
                        jwt
                    },
                }
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Somthing wrongs in services',
            EC: 2,
            DT: '',
        }
    }
}

module.exports = {
    getUsers, createUserServices, registerUser, login

}
