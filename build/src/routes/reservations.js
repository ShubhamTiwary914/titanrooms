"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservations_1 = require("../controllers/reservations");
const schemavalidate_1 = require("../middleware/schemavalidate");
const reservations_2 = require("../db/schemas/reservations");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(false), (0, schemavalidate_1.validateRequest)(reservations_2.reservationValidation.create), reservations_1.createReservation);
router.get('/', (0, auth_1.default)(false), reservations_1.listReservationsByUser);
router.patch('/cancel', (0, auth_1.default)(false), (0, schemavalidate_1.validateRequest)(reservations_2.reservationValidation.cancel), reservations_1.cancelReservation);
router.patch('/', (0, auth_1.default)(false), (0, schemavalidate_1.validateRequest)(reservations_2.reservationValidation.update), reservations_1.updateReservation);
exports.default = router;
