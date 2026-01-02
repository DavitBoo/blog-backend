// routes/mediaRoutes.ts
import { Router } from "express";
import passport from "passport";
import {
  uploadImage,
  listImages,
  getImage,
  deleteImage,
  deleteMultipleImages
} from "../controllers/mediaController";
import { upload } from "../middlewares/multer";

const router = Router();

// Todas las rutas están protegidas con autenticación JWT
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  uploadImage
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  listImages
);

router.get(
  "/:fileName",
  passport.authenticate("jwt", { session: false }),
  getImage
);

router.delete(
  "/:fileName",
  passport.authenticate("jwt", { session: false }),
  deleteImage
);

router.delete(
  "/batch/delete",
  passport.authenticate("jwt", { session: false }),
  deleteMultipleImages
);

export default router;