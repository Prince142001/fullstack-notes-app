import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Firstname cannot be empty."],
            trim: true,
            lowercase: true,
        },
        lastName: {
            type: String,
            required: [true, "Lastname cannot be empty."],
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "Email cannot be empty."],
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password cannot be empty."],
            trim: true,
            minlength: [8, "Must be atleast 8 digit"],
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
