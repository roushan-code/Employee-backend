const { compare } = require("bcrypt");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {sendToken} = require("../middleware/features");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorhandler");


// Create a new user and save it to the database 
exports.newUser = catchAsyncErrors(async (req, res,next) => {
    const { adminId, username, password } = req.body;

    console.log(req.body)

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return next(new ErrorHandler('username already exists', 400));
    }
    if(!adminId || !username || !password){
        return next(new ErrorHandler("Please Enter Admin ID, Username & Password", 400))
    }
    const user = await User.create({
        adminId, username, password,
    });
    
    

    sendToken(res, user, 201, "User created")
})

// Login user 
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password){
        return next(new ErrorHandler("Please Enter Username & Password", 400))
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Username or Password", 404));
    }

    sendToken(res, user, 200, `Welcome Back, ${user.username}`);
})

// logout user
exports.logout = catchAsyncErrors(async (req, res) => {

    res.cookie("employee-token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})