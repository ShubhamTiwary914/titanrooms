"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
exports.updateRoom = updateRoom;
exports.getRoomById = getRoomById;
exports.getRoomsWithFilters = getRoomsWithFilters;
const http_status_codes_1 = require("http-status-codes");
const rooms_1 = require("../db/schemas/rooms");
async function createRoom(req, res) {
    try {
        const room = await rooms_1.roomModel.create({
            ...req.body,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(room);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
async function updateRoom(req, res) {
    try {
        const { id } = req.body;
        console.log(req.body);
        const room = await rooms_1.roomModel.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, { new: true });
        if (!room)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "Room not found" });
        return res.status(http_status_codes_1.StatusCodes.OK).json(room);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
async function getRoomById(req, res) {
    try {
        const { id } = req.params;
        const room = await rooms_1.roomModel.findById(id);
        if (!room)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "Room not found" });
        return res.status(http_status_codes_1.StatusCodes.OK).json(room);
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
async function getRoomsWithFilters(req, res) {
    try {
        const { createdFrom, createdTo, priceMin, priceMax, available, checkInFrom, checkInTo } = req.query;
        const filter = {};
        if (createdFrom || createdTo) {
            filter.createdAt = {};
            if (createdFrom)
                filter.createdAt.$gte = new Date(createdFrom);
            if (createdTo)
                filter.createdAt.$lte = new Date(createdTo);
        }
        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin)
                filter.price.$gte = Number(priceMin);
            if (priceMax)
                filter.price.$lte = Number(priceMax);
        }
        if (available !== undefined)
            filter.isAvailable = available === 'true';
        if (checkInFrom || checkInTo) {
            filter['reservations.checkIn'] = {};
            if (checkInFrom)
                filter['reservations.checkIn'].$gte = new Date(checkInFrom);
            if (checkInTo)
                filter['reservations.checkIn'].$lte = new Date(checkInTo);
        }
        const rooms = await rooms_1.roomModel.find(filter).sort({ createdAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json(rooms);
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}
