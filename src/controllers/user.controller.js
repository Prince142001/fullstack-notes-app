import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (
            [firstName, lastName, email, password].some(
                (field) => field?.trim() === ""
            )
        ) {
            console.log("All fields are required");
            return res.status(404).json({
                message: "All fields are required",
            });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            console.log("User with this email is already existed");
            return res.status(409).json({
                message: "User with this email is already existed",
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            console.log("Something went wrong while creating user");
            return res.status(500).json({
                message: "Something went wrong while creating user",
            });
        }

        const token = user.generateAccessToken();
        return res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: createdUser,
        });
    } catch (error) {
        console.log("Error in register user ", error);
        res.status(500).json({
            message: "Failed to register user.",
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((fields) => fields?.trim() === "")) {
        console.log("Email and password are required");
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        console.log("User with this email is not found");
        return res.status(404).json({
            message: "User with this email is not found",
        });
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        console.log("Invalid user credentials");
        return res.status(401).json({
            message: "Invalid user credentials",
        });
    }

    const user = await User.findOne({ email }).select("-password");

    const token = existingUser.generateAccessToken();

    const option = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200).cookie("accessToken", token, option).json({
        message: "Login successfully",
        token: token,
        user: user,
    });
};

const getUserProfile = async (req, res) => {
    try {
        return res.status(200).json({
            message: "User profile fetched successfully",
            user: req.user,
        });
    } catch (error) {
        console.log("Error in fetching profile", error);
        res.status(500).json({
            message: "Failed to fetch user profile",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName && !lastName) {
            console.log(
                "Please provide fields to update firstName or lastName"
            );
            return res.status(400).json({
                message:
                    "Please provide fields to update firstName or lastName",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                },
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error updating profile", error);
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
