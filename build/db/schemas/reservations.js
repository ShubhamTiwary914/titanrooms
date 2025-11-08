"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationValidation = exports.Reservation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const reservationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
}, { timestamps: true });
exports.Reservation = mongoose_1.default.model('Reservation', reservationSchema);
exports.reservationValidation = {
    create: joi_1.default.object({
        userId: joi_1.default.string().required(),
        roomId: joi_1.default.string().required(),
        checkIn: joi_1.default.date().required(),
        checkOut: joi_1.default.date().greater(joi_1.default.ref('checkIn')).required(),
        token: joi_1.default.string()
    }),
    update: joi_1.default.object({
        id: joi_1.default.string().required(),
        checkIn: joi_1.default.date(),
        checkOut: joi_1.default.date().greater(joi_1.default.ref('checkIn')),
        status: joi_1.default.string().valid('booked', 'cancelled', 'completed'),
        token: joi_1.default.string()
    }),
    cancel: joi_1.default.object({
        id: joi_1.default.string().required(),
        token: joi_1.default.string()
    })
};
