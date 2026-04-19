"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const projectCategoryController_1 = require("../controllers/projectCategoryController");
const router = (0, express_1.Router)();
router.get("/", projectCategoryController_1.getCategories); // Public
router.get("/:id", projectCategoryController_1.getCategoryById); // Public
router.post("/", passport_1.default.authenticate("jwt", { session: false }), projectCategoryController_1.createCategory);
router.patch("/:id", passport_1.default.authenticate("jwt", { session: false }), projectCategoryController_1.updateCategory);
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), projectCategoryController_1.deleteCategory);
exports.default = router;
