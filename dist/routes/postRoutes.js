"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const postController_1 = require("../controllers/postController");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
// Protect routes with Passport
router.get("/backend/", passport_1.default.authenticate("jwt", { session: false }), postController_1.getPostsBackEnd); // This goes first in order to not tro 'backend' string as an id
router.get("/bySlug/:slug", postController_1.getPostBySlug);
router.get("/", postController_1.getPosts); // Public: Get all published posts
router.get("/:id", postController_1.getPostById); // Public: Get a single post by ID
router.post("/", (req, res, next) => {
    console.log('Debug - Request headers:', req.headers);
    console.log('Debug - Request file:', req.file);
    console.log('Debug - Request body:', req.body);
    next();
}, multer_1.upload.single("cover"), passport_1.default.authenticate("jwt", { session: false }), postController_1.createPost);
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), postController_1.updatePost); // Protected: Update a post (requires authentication)
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), postController_1.deletePost); // Protected: Delete a post (requires authentication)
exports.default = router;
