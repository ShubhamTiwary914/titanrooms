import express, { Router, Request, Response } from 'express';
import { validateRequest } from '../middleware/schemavalidate';
import { roomValidation } from '../db/schemas/rooms';
import { createRoom, getRoomsWithFilters, getRoomById, updateRoom } from '../controllers/rooms';
import verifyAdminKey from '../middleware/auth';
const router: Router = express.Router();


router.post('/',
    verifyAdminKey(),
    validateRequest(roomValidation.create, 'body'),
    createRoom
)

//update room
router.patch('/',
    verifyAdminKey(),
    validateRequest(roomValidation.update, 'body'),
    updateRoom
)

router.get('/', getRoomsWithFilters)
router.get('/:id', getRoomById)


export default router;