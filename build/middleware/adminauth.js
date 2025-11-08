"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyAdminKey;
const http_status_codes_1 = require("http-status-codes");
function verifyAdminKey(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Missing or invalid authorization header' });
    const token = authHeader.split(' ')[1];
    if (token !== process.env.ADMIN_KEY)
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: 'Unauthorized admin key' });
    next();
}
