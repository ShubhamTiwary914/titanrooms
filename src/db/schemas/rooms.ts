import mongoose, { Schema } from "mongoose";
import joi from "joi";

interface IRoom {
    id: string
    name: string
    isAvailable: boolean
    createdAt?: Date
    updatedAt?: Date
}

const roomSchema: Schema = new Schema({
    name: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

export const roomModel = mongoose.model<IRoom>("Room", roomSchema)

//Validation schemas
export const roomValidation = {
    create: joi.object<IRoom>({
        name: joi.string().min(2).max(50).required(),
        isAvailable: joi.boolean().default(true)
    }),
    update: joi.object<IRoom>({
        id: joi.string().required(),
        name: joi.string().min(2).max(50),
        isAvailable: joi.boolean()
    })    
}