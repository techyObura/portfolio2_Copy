import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createSlider,
  deleteSlider,
  getSliders,
} from "../controllers/slider.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createSlider);
router.get("/getSlider", getSliders);
router.delete("/deleteSlider/:id", verifyToken, deleteSlider);

export default router;
