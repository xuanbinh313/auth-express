import UserModel from "../model/User.model.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import otpGenerator from 'otp-generator'
/**
 * 
 * @param: {
 * "username": "binhcodev",
 * "password":"123456",
 * "email":"binhcodev@gmail.com",
 * "firstName":"binh",
 * "lastName":"codev",
 * "mobile":"123456789",
 * "address":"An Phu Dong, Q12, Ho Chi Minh city",
 * "profile":""
 * } req.params
 */
export const SECRET_KEY = "binhcodev"
export async function register(req, res) {
    const { email, password, username, profile } = req.body
    const existUsername = new Promise((resolve, reject) => {
        UserModel.findOne({ username }).then(user => {
            if (user) reject({ error: "Please use unique username" })
            resolve()
        }).catch(err => reject(new Error(err)))
    })
    const existEmail = new Promise((resolve, reject) => {
        UserModel.findOne({ email }).then(email => {
            if (email) reject({ error: "Please use unique email" })
            resolve()
        }).catch(err => reject(new Error(err)))
    })
    Promise.all([existUsername, existEmail]).then(async () => {
        if (password) {
            try {
                const hashPassword = await bcrypt.hash(password, 10)
                const user = new UserModel({ email, password: hashPassword, username, profile: profile || '' })
                await user.save()
                res.status(201).send({ msg: "Created Success" })
            } catch (error) {
                res.status(500).send({ error, errorCode: "SYSTEM_ERROR" })
            }

        }
    }).catch(e => res.status(500).send({ error: "Have problem when check username, email" }))

}
export async function registerMail(req, res) {
    res.json("registerMail route")
}
export async function login(req, res) {
    const { username, password } = req.body
    UserModel.findOne({ username }).then(async user => {
        try {
            const isCorrect = await bcrypt.compare(password, user.password)
            if (!isCorrect) return res.status(400).send({ error: "Wrong password" })
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "24h" })
            return res.status(200).send({ msg: "Login successful", username: user.username, token })
        } catch (error) {
            res.status(500).send({ error: "Error when campare password" })
        }
    }).catch(e => res.status(400).send({ error: "Have problem when check user" }))
}

export async function getUser(req, res) {
    const { userId } = req.user
    try {
        UserModel.findOne({ _id: userId }).then(user => {
            if (!user) return res.status(501).send({ error: "Could not found user" })
            const { password, ...rest } = Object.assign({}, user.toJSON())
            res.status(200).send(rest)
        }).catch((error) => res.status(500).send({ error: error.message }))
    } catch (error) {
        return res.status(404).send({ error: "Not found user" })

    }
}
export async function updateUser(req, res) {
    try {
        const { userId } = req.user
        if (userId) {
            UserModel.findByIdAndUpdate(userId, req.body)
                .then((user) => {
                    const { password, _id, ...rest } = Object.assign({}, user.toJSON())
                    res.status(200).send({ msg: "Update successful.", user: rest })
                })
                .catch(error => {
                    res.status(500).send(error.message)
                })
        } else {
            res.status(401).send({ error: "User not found." })
        }
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
}
export async function generateOTP(req, res) {
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    req.app.locals.OTP = OTP
    res.json(OTP)
}

export async function verifyOTP(req, res) {
    const { code } = req.query
    if (parseInt(code) === parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP = null // reset OTP
        req.app.locals.resetSession = true // start session reset
        return res.send({ msg: "Verify OTP success" })
    }
    return res.status(400).send("Invalid OTP")
}

export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) return res.send({ flag: req.app.locals.resetSession })
    return res.status(440).send({ msg: "Session expired." })
}

export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(440).send({ msg: "Session expired." })
        const { username, password } = req.body
        const user = await UserModel.findOne({ username })
        if (!user) return res.status(404).send({ error: "Username not found" })
        const hashPassword = await bcrypt.hash(password, 10)
        await UserModel.updateOne({ username }, { password: hashPassword })
        req.app.locals.resetSession = false
        return res.send({ msg: "Update success" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}