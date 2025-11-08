import mongoose, { Schema, Document } from 'mongoose';
import joi from 'joi';

interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  status: 'booked' | 'cancelled' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export const reservationValidation = {
  create: joi.object({
    userId: joi.string().required(),
    roomId: joi.string().required(),
    checkIn: joi.date().required(),
    checkOut: joi.date().greater(joi.ref('checkIn')).required(),
    token: joi.string()
  }),
  
  update: joi.object({
    id: joi.string().required(),
    checkIn: joi.date(),
    checkOut: joi.date().greater(joi.ref('checkIn')),
    status: joi.string().valid('booked', 'cancelled', 'completed'),
    token: joi.string()
  }),

  cancel: joi.object({
    id: joi.string().required(),
    token: joi.string()
  })
};