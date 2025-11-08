import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';

//when strict = only admin access
//when not strict = can skip admin access, but passes boolean status
export default function verifyAdminKey(strict: boolean = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (strict)
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing or invalid authorization header' });
      (req as any).isAdmin = false;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if(token !== process.env.ADMIN_KEY) {
      if(strict)
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Unauthorized admin key' });
      (req as any).isAdmin = false;
      return next();
    }

    (req as any).isAdmin = true;
    next();
  };
}

export function verifyUserTokenMatch(token: string, id: string): boolean {
  try{
    const decoded = jwt.verify(token, process.env.JWT_TOKEN as string) as JwtPayload;
    return decoded.id === id;
  }catch {
      return false;
  }
}
