import userServices from '../services/UserServices'
import db from "../models/index";

const register = async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.gender) {
            return res.json({
                EM: 'Missing required parmeters',   // Error Messeger
                EC: '1',                            // Error Code
                DT: '',                             // Data
            })
        }
        let data = await userServices.registerUser(req.body)
        return res.json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (e) {
        return res.json({
            EM: 'error from server', // Error Messeger
            EC: '-1', // Error Code
            DT: '', // Data
        })
    }
}

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.json({
                EM: 'Missing required parmeters',   // Error Messeger
                EC: '-1',                            // Error Code
                DT: '',                             // Data
            })
        }
        let data = await userServices.login(req.body)
        res.cookie("jwt", 'jwt = 123 from sever', { httpOnly: true, maxAge: 60 * 60 * 1000 })
        console.log('run');
        return res.json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (e) {
        return res.json({
            EM: 'error from server', // Error Messeger
            EC: '-1', // Error Code
            DT: '', // Data
        })
    }
}

module.exports = {
    register, login,
}