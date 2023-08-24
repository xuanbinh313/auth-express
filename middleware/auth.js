import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../controller/appController.js"
import UserModel from "../model/User.model.js"

export default async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const user = jwt.verify(token, SECRET_KEY)
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: "Authentication Failed." })
    }
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}

export function verifyUser(req, res, next) {
    const { username } = req.method = "GET" ? req.query : req.body
    if (username) {
        UserModel.findOne({ username }).then(user => {
            if (!user) return res.status(401).send({ error: "User not found" })
            return next()

        }).catch(e => res.status(500).send({ error: e.message }))
    } else {
        res.status(401).send({ error: "User not found" })
    }
}