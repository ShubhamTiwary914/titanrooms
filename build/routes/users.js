"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../db/schemas/users");
const users_2 = require("../controllers/users");
const schemavalidate_1 = require("../middleware/schemavalidate");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/register', (0, auth_1.default)(), (0, schemavalidate_1.validateRequest)(users_1.registerSchema, 'body'), users_2.createUser);
//unhash password, gen token if pass match
router.post('/login', (0, schemavalidate_1.validateRequest)(users_1.loginSchema, 'body'), users_2.loginUser);
// //new access token init
router.put('/refresh-token', (0, schemavalidate_1.validateRequest)(users_1.refreshTokenSchema, 'body'), users_2.refreshToken);
// //reset password for user-auth (pass old password or token)
router.put('/reset-pass', (0, auth_1.default)(), (0, schemavalidate_1.validateRequest)(users_1.passwordResetSchema, 'body'), users_2.resetPassword);
// list all users
router.get('/', (0, auth_1.default)(), users_2.getAllUsers);
// //get user by id
router.get('/:id', (0, auth_1.default)(), users_2.getUserById);
exports.default = router;
