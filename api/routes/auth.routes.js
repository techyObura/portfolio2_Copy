import express from "express";
import {
  createUser,
  googleAuth,
  loginUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

export default router;
