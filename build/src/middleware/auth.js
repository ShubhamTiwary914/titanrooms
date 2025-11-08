"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyAdminKey;
exports.verifyUserTokenMatch = verifyUserTokenMatch;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//when strict = only admin access
//when not strict = can skip admin access, but passes boolean status
function verifyAdminKey(strict = true) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            if (strict)
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Missing or invalid authorization header' });
            req.isAdmin = false;
            return next();
        }
        const token = authHeader.split(' ')[1];
        if (token !== process.env.ADMIN_KEY) {
            if (strict)
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: 'Unauthorized admin key' });
            req.isAdmin = false;
            return next();
        }
        req.isAdmin = true;
        next();
    };
}
function verifyUserTokenMatch(token, id) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
        return decoded.id === id;
    }
    catch {
        return false;
    }
}
