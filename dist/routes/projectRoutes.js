"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const projectController_1 = require("../controllers/projectController");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
router.get("/backend/", passport_1.default.authenticate("jwt", { session: false }), projectController_1.getProjectsBackEnd);
router.get("/bySlug/:slug", projectController_1.getProjectBySlug);
router.get("/", projectController_1.getProjects); // Public
router.get("/:id", projectController_1.getProjectById); // Public
router.post("/", multer_1.upload.single("cover"), passport_1.default.authenticate("jwt", { session: false }), projectController_1.createProject);
router.patch("/:id", multer_1.upload.single("cover"), passport_1.default.authenticate("jwt", { session: false }), projectController_1.updateProject);
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), projectController_1.deleteProject);
exports.default = router;
