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
exports.passwordResetSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date
});
exports.userModel = mongoose_1.default.model('User', userSchema);
//JOI schemas
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(5).max(30).required(),
    email: joi_1.default.string().email().required(),
    passwordHash: joi_1.default.string().base64().required()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    passwordHash: joi_1.default.string().base64().required()
});
exports.refreshTokenSchema = joi_1.default.object({
    token: joi_1.default.string()
});
exports.passwordResetSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    currentPasswordHash: joi_1.default.string().base64(),
    token: joi_1.default.string(),
    newPasswordHash: joi_1.default.string().base64().required()
});
