const jwt = require("jsonwebtoken");

const catchAsyncErrors = require("./catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorhandler.js");
const User = require("../models/User.js");


const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies["employee-token"];
    
    if (!token) return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
})

module.exports = isAuthenticated;