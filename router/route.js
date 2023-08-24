import { Router } from "express";
import * as controller from '../controller/appController.js'
import auth, { localVariables, verifyUser } from "../middleware/auth.js";
const router = Router()

/** POST */
router.route('/register').post(controller.register)
// send a email
router.route('/registerMail').post(controller.registerMail)
// authenticate user
router.route('/authenticate').post(() => res.end())
// login
router.route('/login').post(controller.login)

/** GET */
// user with username
router.route('/user').get(auth, controller.getUser)
// get OTP
router.route('/generateOTP').get(verifyUser, localVariables, controller.generateOTP)
// verify OTP
router.route('/verifyOTP').get(verifyUser, controller.verifyOTP)
// reset all variables
router.route('/createResetSession').get(controller.createResetSession)

/** PUT */
// update profile
router.route('/user').put(auth, controller.updateUser)
// reset password
router.route('/resetPassword').put(controller.resetPassword)

export default router