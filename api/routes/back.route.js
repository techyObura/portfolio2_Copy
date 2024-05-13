import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  editBackground,
  getBackground,
} from "../controllers/back.controller.js";

const router = express.Router();

router.put("/editBackground", editBackground);
router.get("/background", getBackground);

export default router;
