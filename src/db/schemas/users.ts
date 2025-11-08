import mongoose, { Schema } from'mongoose';
import joi from 'joi';

interface IUser {
  name: string
  email: string
  passwordHash: string
  createdAt?: Date
  updatedAt?: Date
}

interface IUserAuth{
  email: string
  token: string
  currentPasswordHash: string
  newPasswordHash: string
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date
});



export const userModel = mongoose.model<IUser>('User', userSchema);


//JOI schemas
export const registerSchema : joi.ObjectSchema = joi.object<IUser>({
  name: joi.string().alphanum().min(5).max(30).required(),
  email: joi.string().email().required(),
  passwordHash: joi.string().base64().required()
})

export const loginSchema  : joi.ObjectSchema = joi.object<IUser>({
  email: joi.string().email().required(),
  passwordHash: joi.string().base64().required()
})

export const refreshTokenSchema : joi.ObjectSchema = joi.object<IUserAuth>({
  token: joi.string()
})

export const passwordResetSchema : joi.ObjectSchema = joi.object<IUserAuth>({
  email: joi.string().email().required(),
  currentPasswordHash: joi.string().base64(),
  token: joi.string(),
  newPasswordHash: joi.string().base64().required()
})