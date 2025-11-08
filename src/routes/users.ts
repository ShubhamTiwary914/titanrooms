import express, { Router } from 'express';
import { loginSchema, passwordResetSchema, refreshTokenSchema, registerSchema } from '../db/schemas/users'
import { createUser, getAllUsers, getUserById, loginUser, refreshToken, resetPassword } from '../controllers/users'
import { validateRequest } from '../middleware/schemavalidate';
import verifyAdminKey from '../middleware/auth';

const router: Router = express.Router();

router.post(
    '/register', 
    verifyAdminKey(), 
    validateRequest(registerSchema, 'body'), 
    createUser 
)

//unhash password, gen token if pass match
router.post('/login',
    validateRequest(loginSchema, 'body'),
    loginUser
)

// //new access token init
router.put('/refresh-token', 
    validateRequest(refreshTokenSchema, 'body'),
    refreshToken
)

// //reset password for user-auth (pass old password or token)
router.put('/reset-pass',
    verifyAdminKey(), 
    validateRequest(passwordResetSchema, 'body'),
    resetPassword
)

// list all users
router.get('/',
    verifyAdminKey(),
    getAllUsers
)


// //get user by id
router.get('/:id', 
    verifyAdminKey(),
    getUserById
)

export default router;