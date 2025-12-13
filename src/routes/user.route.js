import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router
    .route("/profile")
    .get(verifyJwtToken, getUserProfile)
    .patch(verifyJwtToken, updateUserProfile);

export default router;
