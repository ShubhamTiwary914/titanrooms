import { Request, Response } from 'express';
import { Reservation, reservationValidation } from '../db/schemas/reservations';
import { StatusCodes } from 'http-status-codes';
import { userModel } from '../db/schemas/users';
import { roomModel } from '../db/schemas/rooms';
import { verifyUserTokenMatch } from '../middleware/auth';


export const createReservation = async (req: Request, res: Response) => {
  const { roomId, userId, token } = req.body

  if(!(req as any).isAdmin) {
    if(!token || !userId || !verifyUserTokenMatch(token, userId))
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
  }
  const reservation = new Reservation(req.body);
  const saved = await reservation.save();
  //update room availability
  await roomModel.findByIdAndUpdate(roomId, {
    isAvailable: false
  })

  res.status(StatusCodes.CREATED).json(saved);
};


export const cancelReservation = async (req: Request, res: Response) => {
  const { id, token } = req.body;
  const reservation = await Reservation.findById(id);
  if(!reservation) 
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Reservation not found' });

  if(!(req as any).isAdmin) {
    if(!token || !verifyUserTokenMatch(token, reservation.userId.toString()))
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
  }

  const updated = await Reservation.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
  res.json(updated);
};

export const updateReservation = async (req: Request, res: Response) => {
  const { id, token } = req.body;
  const reservation = await Reservation.findById(id);
  if(!reservation) 
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Reservation not found' });

  if (!(req as any).isAdmin) {
    if (!token || !verifyUserTokenMatch(token, reservation.userId.toString()))
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
  }

  const updated = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};


//list rooms by email/id of user & some filters 
export const listReservationsByUser = async (req: Request, res: Response) => {
  try {
    const { id, email, checkInFrom, checkInTo, createdFrom, createdTo, status, token } = req.query;
    const filter: any = {};
    if(id) 
      filter.userId = id as string;

    if (email) {
      const user = await userModel.findOne({ email });
      if (!user) 
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      filter.userId = user._id;
    }

    if (!(req as any).isAdmin) {
      if (!token || !filter.id || !verifyUserTokenMatch(token as string, filter.id))
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized token - either use Admin or User Token' });
    }

    if(status) 
      filter.status = status;

    if(checkInFrom || checkInTo) {
      filter.checkIn = {};
      if (checkInFrom) 
        filter.checkIn.$gte = new Date(checkInFrom as string);
      if(checkInTo) 
        filter.checkIn.$lte = new Date(checkInTo as string);
    }

    if (createdFrom || createdTo) {
      filter.createdAt = {};
      if(createdFrom) 
        filter.createdAt.$gte = new Date(createdFrom as string);
      if(createdTo) 
        filter.createdAt.$lte = new Date(createdTo as string);
    }

    const reservations = await Reservation.find(filter)
      .populate('roomId userId')
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(reservations);
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};