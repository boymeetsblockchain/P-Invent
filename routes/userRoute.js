const express = require('express')
const { registerUser,loginUser,logout, logOut} = require('../controllers/userController')

const router = express.Router()



router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logOut)

module.exports = router