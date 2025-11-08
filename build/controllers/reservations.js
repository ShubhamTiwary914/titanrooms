"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReservationsByUser = exports.updateReservation = exports.cancelReservation = exports.createReservation = void 0;
const reservations_1 = require("../db/schemas/reservations");
const http_status_codes_1 = require("http-status-codes");
const users_1 = require("../db/schemas/users");
const rooms_1 = require("../db/schemas/rooms");
const auth_1 = require("../middleware/auth");
const createReservation = async (req, res) => {
    const { roomId, userId, token } = req.body;
    if (!req.isAdmin) {
        if (!token || !userId || !(0, auth_1.verifyUserTokenMatch)(token, userId))
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
    }
    const reservation = new reservations_1.Reservation(req.body);
    const saved = await reservation.save();
    //update room availability
    await rooms_1.roomModel.findByIdAndUpdate(roomId, {
        isAvailable: false
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(saved);
};
exports.createReservation = createReservation;
const cancelReservation = async (req, res) => {
    const { id, token } = req.body;
    const reservation = await reservations_1.Reservation.findById(id);
    if (!reservation)
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Reservation not found' });
    if (!req.isAdmin) {
        if (!token || !(0, auth_1.verifyUserTokenMatch)(token, reservation.userId.toString()))
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
    }
    const updated = await reservations_1.Reservation.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    res.json(updated);
};
exports.cancelReservation = cancelReservation;
const updateReservation = async (req, res) => {
    const { id, token } = req.body;
    const reservation = await reservations_1.Reservation.findById(id);
    if (!reservation)
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Reservation not found' });
    if (!req.isAdmin) {
        if (!token || !(0, auth_1.verifyUserTokenMatch)(token, reservation.userId.toString()))
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
    }
    const updated = await reservations_1.Reservation.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
};
exports.updateReservation = updateReservation;
//list rooms by email/id of user & some filters 
const listReservationsByUser = async (req, res) => {
    try {
        const { id, email, checkInFrom, checkInTo, createdFrom, createdTo, status, token } = req.query;
        const filter = {};
        if (id)
            filter.userId = id;
        if (email) {
            const user = await users_1.userModel.findOne({ email });
            if (!user)
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            filter.userId = user._id;
        }
        if (!req.isAdmin) {
            if (!token || !filter.id || !(0, auth_1.verifyUserTokenMatch)(token, filter.id))
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
        }
        if (status)
            filter.status = status;
        if (checkInFrom || checkInTo) {
            filter.checkIn = {};
            if (checkInFrom)
                filter.checkIn.$gte = new Date(checkInFrom);
            if (checkInTo)
                filter.checkIn.$lte = new Date(checkInTo);
        }
        if (createdFrom || createdTo) {
            filter.createdAt = {};
            if (createdFrom)
                filter.createdAt.$gte = new Date(createdFrom);
            if (createdTo)
                filter.createdAt.$lte = new Date(createdTo);
        }
        const reservations = await reservations_1.Reservation.find(filter)
            .populate('roomId userId')
            .sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json(reservations);
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};
exports.listReservationsByUser = listReservationsByUser;
