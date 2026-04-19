import { Router } from "express";
import passport from "passport";
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  getProjectsBackEnd,
} from "../controllers/projectController";
import { upload } from "../middlewares/multer";

const router = Router();

router.get("/backend/", passport.authenticate("jwt", { session: false }), getProjectsBackEnd);
router.get("/bySlug/:slug", getProjectBySlug);
router.get("/", getProjects); // Public
router.get("/:id", getProjectById); // Public

router.post("/", 
    upload.single("cover"),
    passport.authenticate("jwt", { session: false }),
    createProject
);

router.patch("/:id", 
    upload.single("cover"),
    passport.authenticate("jwt", { session: false }), 
    updateProject
);

router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteProject);

export default router;
