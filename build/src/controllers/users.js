"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.refreshToken = refreshToken;
exports.resetPassword = resetPassword;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
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
async function refreshToken(req, res) {
    try {
        // console.log(req.body)
        const { token } = req.body;
        if (!token)
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Old Token required" });
        const secret = process.env.JWT_TOKEN;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const newToken = jsonwebtoken_1.default.sign({
            id: decoded.id
        }, secret, { expiresIn: tokenExpiryTime });
        return res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ token: newToken });
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
    }
}
//either one: active token or old password is needed to reset
async function resetPassword(req, res) {
    try {
        const { email, currentPasswordHash, token, newPasswordHash } = req.body;
        const user = await users_1.userModel.findOne({ email });
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "User not found" });
        //!check token or pass
        let authorized = false;
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded.id === user._id.toString())
                authorized = true;
        }
        if (!authorized && currentPasswordHash) {
            const decodedPassword = Buffer.from(currentPasswordHash, "base64").toString("utf-8");
            const valid = await bcrypt_1.default.compare(decodedPassword, user.passwordHash);
            if (valid)
                authorized = true;
        }
        if (!authorized)
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Invalid token or password" });
        //change password
        const decodedNewPassword = Buffer.from(newPasswordHash, "base64").toString('utf-8');
        const hashedNewPassword = await bcrypt_1.default.hash(decodedNewPassword, saltRounds);
        await users_1.userModel.updateOne({ email }, { passwordHash: hashedNewPassword, updatedAt: Date.now() });
        return res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ message: "Password reset successful" });
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
async function getAllUsers(req, res) {
    try {
        // console.log('getting all')
        const users = await users_1.userModel.find({}, "-passwordHash");
        return res.status(http_status_codes_1.StatusCodes.OK).json(users);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await users_1.userModel.findById(id, "-passwordHash");
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "User not found" });
        return res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
//utils
function decodeJWT(token) {
    const secret = process.env.JWT_TOKEN;
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
}
