"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemavalidate_1 = require("../middleware/schemavalidate");
const rooms_1 = require("../db/schemas/rooms");
const rooms_2 = require("../controllers/rooms");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(), (0, schemavalidate_1.validateRequest)(rooms_1.roomValidation.create, 'body'), rooms_2.createRoom);
//update room
router.patch('/', (0, auth_1.default)(), (0, schemavalidate_1.validateRequest)(rooms_1.roomValidation.update, 'body'), rooms_2.updateRoom);
router.get('/', rooms_2.getRoomsWithFilters);
router.get('/:id', rooms_2.getRoomById);
exports.default = router;
