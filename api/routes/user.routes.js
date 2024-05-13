import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  logoutUser,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get/:userId", getUser);
router.get("/:userId", verifyToken, getUsers);
router.delete("/delete/:userId/:id", verifyToken, deleteUser);
router.put("/update/:userId", verifyToken, updateUser);
router.post("/logout", logoutUser);

export default router;
