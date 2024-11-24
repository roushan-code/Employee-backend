const { hash } = require('bcrypt');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    adminId: {
        type: Number,
        unique: true,
        required: true
    }, 
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    } // Store hashed passwords
});

// JWT TOKEN
UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
  };

// Encrypting password before saving user
UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
})

module.exports = mongoose.model('User', UserSchema);
