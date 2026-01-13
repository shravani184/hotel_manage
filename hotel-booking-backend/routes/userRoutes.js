import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getProfile, updateUserProfile, getUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();  

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
