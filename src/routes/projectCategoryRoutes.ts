import { Router } from "express";
import passport from "passport";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/projectCategoryController";

const router = Router();

router.get("/", getCategories); // Public
router.get("/:id", getCategoryById); // Public
router.post("/", passport.authenticate("jwt", { session: false }), createCategory);
router.patch("/:id", passport.authenticate("jwt", { session: false }), updateCategory);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteCategory);

export default router;
