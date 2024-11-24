const { newUser, login, logout } = require("../controllers/user");
const express = require("express");
const isAuthenticated = require("../middleware/auth");

const router = express.Router();

router.post("/register", newUser)
router.post("/login",  login)

// After here user must be Logged in to access the routes
router.use(isAuthenticated)
router.get("/me", (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    })
})
router.get("/logout",  logout);


module.exports = router;