"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const labelController_1 = require("../controllers/labelController");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post('/:postId', labelController_1.createLabel);
router.post('/', passport_1.default.authenticate('jwt', { session: false }), labelController_1.createLabel);
router.get('/', labelController_1.getAllLabels);
router.delete('/:id', passport_1.default.authenticate('jwt', { session: false }), labelController_1.deleteLabel);
router.patch('/:id', passport_1.default.authenticate('jwt', { session: false }), labelController_1.updateLabel);
exports.default = router;
