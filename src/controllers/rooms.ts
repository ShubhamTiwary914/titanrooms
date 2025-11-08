import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { roomModel } from "../db/schemas/rooms"


export async function createRoom(req: Request, res: Response) {
    try{
        const room = await roomModel.create({
            ...req.body,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return res.status(StatusCodes.CREATED).json(room);
    }catch(err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

export async function updateRoom(req: Request, res: Response) {
    try {
        const { id } = req.body;
        console.log(req.body)
        const room = await roomModel.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if(!room)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
        return res.status(StatusCodes.OK).json(room);
    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}


export async function getRoomById(req: Request, res: Response) {
    try{
        const { id } = req.params;
        const room = await roomModel.findById(id);
        if(!room)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
        return res.status(StatusCodes.OK).json(room);
    }catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

export async function getRoomsWithFilters(req: Request, res: Response) {
  try {
    const { createdFrom, createdTo, priceMin, priceMax, available, checkInFrom, checkInTo } = req.query;
    const filter: any = {};

    if(createdFrom || createdTo) {
        filter.createdAt = {};
        if(createdFrom) 
            filter.createdAt.$gte = new Date(createdFrom as string);
        if(createdTo) 
            filter.createdAt.$lte = new Date(createdTo as string);
    }

    if (priceMin || priceMax) {
        filter.price = {};
        if(priceMin) 
            filter.price.$gte = Number(priceMin);
        if(priceMax) 
            filter.price.$lte = Number(priceMax);
    }

    if(available !== undefined) 
        filter.isAvailable = available === 'true';

    if(checkInFrom || checkInTo) {
        filter['reservations.checkIn'] = {};
        if(checkInFrom) 
            filter['reservations.checkIn'].$gte = new Date(checkInFrom as string);
        if(checkInTo) 
            filter['reservations.checkIn'].$lte = new Date(checkInTo as string);
    }

    const rooms = await roomModel.find(filter).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(rooms);

  }catch (err: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
}