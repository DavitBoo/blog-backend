import { Router } from "express";
import passport from "passport";
import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  getPostsBackEnd,
} from "../controllers/postController";
import { upload } from "../middlewares/multer";

const router = Router();

// Protect routes with Passport
router.get("/backend/", passport.authenticate("jwt", { session: false }), getPostsBackEnd); // This goes first in order to not tro 'backend' string as an id
router.get("/bySlug/:slug", getPostBySlug);
router.get("/", getPosts); // Public: Get all published posts
router.get("/:id", getPostById); // Public: Get a single post by ID
router.post("/", 
    (req, res, next) => {
        console.log('Debug - Request headers:', req.headers);
        console.log('Debug - Request file:', req.file);
        console.log('Debug - Request body:', req.body);
        next();
    },
    upload.single("cover"),
    passport.authenticate("jwt", { session: false }),
    createPost
);
router.patch("/:id", passport.authenticate("jwt", { session: false }), updatePost); // Protected: Update a post (requires authentication)
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePost); // Protected: Delete a post (requires authentication)

export default router;
