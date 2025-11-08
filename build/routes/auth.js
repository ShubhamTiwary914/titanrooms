"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./../db/schemas/users");
const auth_1 = require("../controllers/auth");
const schemavalidate_1 = require("../middleware/schemavalidate");
const router = express_1.default.Router();
//signup with password hash
router.post('/register', (0, schemavalidate_1.validateRequest)(users_1.registerSchema, 'body'), auth_1.createUser);
//unhash password, gen token if pass match
router.post('/login', (0, schemavalidate_1.validateRequest)(users_1.loginSchema, 'body'), auth_1.loginUser);
// //new access token init
// router.get('/refresh')
// //reset password for user-auth
// router.put('/reset-pass')
exports.default = router;
