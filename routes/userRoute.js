const express = require('express')
const { registerUser,
    loginUser,
    logOut,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
forgotPassword} = require('../controllers/userController')
const protect = require('../middleWare/authMiddleware')
const router = express.Router()



router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logOut)
router.get("/loggedin", loginStatus)
router.get("/getuser",protect, getUser)
router.patch("/updateuser",protect, updateUser)
router.patch("/changepassword",protect,changePassword)
router.post("/forgotpassword",forgotPassword)

module.exports = router