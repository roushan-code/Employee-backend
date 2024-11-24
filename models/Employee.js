const mongoose = require('mongoose');
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        maxLength: [30, "Name cannot exceed 30 characters"],
     },
    email: { 
        type: String, 
        required: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
     },
    phone: { 
        type: String, 
        required: true,
        minLength: [10, "Mobile number should be 10 characters"],
     },
    gender: { 
        type: String, 
        required: true,
        enum: ["Male", "Female"]
     },
    course: { 
        type: String, 
        required: true,
        enum: ["BSC", "MCA", "BCA"]
     },
    designation: { 
        type: String, 
        required: true,
        enum: ["HR", "Manager", "sales"]
     },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true,
        }
    }, // Image URL
},
{
    timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);
