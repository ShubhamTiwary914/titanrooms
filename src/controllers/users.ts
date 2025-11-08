import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userModel } from '../db/schemas/users';
import bcrypt from "bcrypt"
import jwt, { Secret } from "jsonwebtoken";

const saltRounds : number = 10
const tokenExpiryTime : any = '1h'

export async function createUser(req: Request, res: Response){
    try {
        let passBase64 : string = req.body['passwordHash']
        const decodedPassword = Buffer.from(passBase64, 'base64').toString('utf-8');
        const hashedPassword = await bcrypt.hash(decodedPassword, saltRounds);
        
        const user = await userModel.create({
            ...req.body, 
            passwordHash: hashedPassword,
            createdAt: Date.now(),
            updatedAt: Date.now() 
        })
        return res.status(StatusCodes.CREATED).json(user);
    }
    catch(err: any) {
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}


export async function loginUser(req: Request, res: Response){
    try {
        const { email, passwordHash } = req.body;
        const decodedPassword = Buffer.from(passwordHash, 'base64').toString('utf-8');

        const user = await userModel.findOne({ email });
        if(!user) 
            return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });

        const valid = await bcrypt.compare(decodedPassword, user.passwordHash);
        if(!valid) 
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "invalid credentials!" });

        const token = jwt.sign(
            { id: user._id.toString() } as object,
            process.env.JWT_TOKEN as Secret,
            { expiresIn: "1h" }
        );
        return res.status(StatusCodes.ACCEPTED).json({ token });

    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}

export async function refreshToken(req: Request, res: Response) {
    try {
        // console.log(req.body)
        const { token } = req.body;
        if(!token) 
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Old Token required" });
    
        const secret = process.env.JWT_TOKEN as Secret;
        const decoded = jwt.verify(token, secret) as { id: string };
        const newToken = jwt.sign({ 
            id: decoded.id }, 
            secret, { expiresIn: tokenExpiryTime }
        );
       return res.status(StatusCodes.ACCEPTED).json({ token: newToken }); 
    }
    catch(err){
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
    }
}

//either one: active token or old password is needed to reset
export async function resetPassword(req: Request, res: Response){
    try{
        const { email, currentPasswordHash, token, newPasswordHash } = req.body;
        const user = await userModel.findOne({ email });
        if(!user) 
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

        //!check token or pass
        let authorized = false;
        if(token) {
            const decoded = decodeJWT(token)
            if (decoded.id === user._id.toString()) 
                authorized = true;    
        }
        if(!authorized && currentPasswordHash) {
            const decodedPassword = Buffer.from(currentPasswordHash, "base64").toString("utf-8");
            const valid = await bcrypt.compare(decodedPassword, user.passwordHash);
            if(valid) 
                authorized = true;
        }
        if(!authorized)
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token or password" });

        //change password
        const decodedNewPassword = Buffer.from(newPasswordHash, "base64").toString('utf-8');
        const hashedNewPassword = await bcrypt.hash(decodedNewPassword, saltRounds);
        await userModel.updateOne(
            { email },
            { passwordHash: hashedNewPassword, updatedAt: Date.now() }
        );
        return res.status(StatusCodes.ACCEPTED).json({ message: "Password reset successful" });
    }
    catch(err: any){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        // console.log('getting all')
        const users = await userModel.find({}, "-passwordHash"); 
        return res.status(StatusCodes.OK).json(users);
    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: err.message });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id, "-passwordHash");
        if (!user)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });

        return res.status(StatusCodes.OK).json(user);
    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

//utils
function decodeJWT(token: any) : jwt.JwtPayload {
    const secret = process.env.JWT_TOKEN as Secret;
    const decoded = jwt.verify(token, secret) as { id: string };
    return decoded;
}