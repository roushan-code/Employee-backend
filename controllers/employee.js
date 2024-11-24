const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { uploadFilesToCloudinary, deleteFilesFromCloudinary } = require("../middleware/features");
const Employee = require("../models/Employee");
const ErrorHandler = require("../utils/errorhandler");

// Create a new employee and save it to the database
exports.createEmployee = catchAsyncErrors(async (req, res, next) => {
    const {  name, email, phone, gender, course, designation } = req.body;
    // console.log(req.body);

    const file = req.file;
    if (!file) return next(new ErrorHandler("Please Upload Image", 400));
    // console.log(file)
    const result = await uploadFilesToCloudinary([file]);
    // console.log(result);
   
    const image = {
        public_id: result[0].public_id,
        url: result[0].url
    }

    if(!name || !email || !phone || !gender || !course || !designation) {
        return next(new ErrorHandler("Please fill in all fields", 400));
        }

    const employee = await Employee.create({
        name,
        email,
        phone,
        gender,
        course,
        image,
        designation
    });

    res.status(201).json({
        success: true,
        message: "Employee created",
        data: employee,
    });
})

// Get all employees
exports.getAllEmployees = catchAsyncErrors(async (req, res, next) => {
    const employees = await Employee.find();
    res.status(200).json({
        success: true,
        data: employees
        });
})

// Get single employee
exports.getEmployeeById = catchAsyncErrors(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);

    if(!employee) {
        return next(new ErrorHandler("Employee not found", 404));
    }

    res.status(200).json({
        success: true,
        data: employee
    });
})

// Delete employees
exports.deleteEmployee = catchAsyncErrors(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);

    if(!employee) {
        return next(new ErrorHandler("Employee not found", 404));
    }

    await deleteFilesFromCloudinary(employee.image.public_id);

    await employee.deleteOne();

    res.status(200).json({
        success: true,
        message: "Employee deleted"
    });
})

// Update employee
exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
    let employee = await Employee.findById(req.params.id);

    if(!employee) {
        return next(new ErrorHandler("Employee not found", 404));
    }

    const file = req.file;
    console.log(file);
    if(file) {
        const result = await uploadFilesToCloudinary([file]);

        if(result){
            // console.log(employee.image.public_id);
            await deleteFilesFromCloudinary(employee.image.public_id);
        }
        const image = {
            public_id: result[0].public_id,
            url: result[0].url
        }
        req.body.image = image;
    }
    console.log(req.body);
    employee = await Employee.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });


    res.status(200).json({
        success: true,
        data: employee
    });
    
})