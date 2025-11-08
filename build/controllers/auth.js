"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
const http_status_codes_1 = require("http-status-codes");
const users_1 = require("../db/schemas/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
const tokenExpiryTime = '1h';
async function createUser(req, res) {
    try {
        let passBase64 = req.body['passwordHash'];
        const decodedPassword = Buffer.from(passBase64, 'base64').toString('utf-8');
        const hashedPassword = await bcrypt_1.default.hash(decodedPassword, saltRounds);
        const user = await users_1.userModel.create({
            ...req.body,
            passwordHash: hashedPassword,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(user);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}
async function loginUser(req, res) {
    try {
        const { email, passwordHash } = req.body;
        const decodedPassword = Buffer.from(passwordHash, 'base64').toString('utf-8');
        const user = await users_1.userModel.findOne({ email });
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "user not found" });
        const valid = await bcrypt_1.default.compare(decodedPassword, user.passwordHash);
        if (!valid)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "invalid credentials!" });
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_TOKEN, { expiresIn: "1h" });
        return res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ token });
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}
