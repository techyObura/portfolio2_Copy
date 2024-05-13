import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createProject,
  deleteProject,
  editProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();
router.post("/create/:id", verifyToken, createProject);
router.put("/edit/:id", verifyToken, editProject);
router.get("/getProjects", getProjects);
router.delete("/deleteProject/:id", verifyToken, deleteProject);

export default router;
