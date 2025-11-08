import express from 'express';
import {
  createReservation,
  listReservationsByUser,
  cancelReservation,
  updateReservation,
} from '../controllers/reservations';
import { validateRequest } from '../middleware/schemavalidate';
import { reservationValidation } from '../db/schemas/reservations';
import verifyAdminKey from '../middleware/auth';

const router = express.Router();

router.post('/', 
    verifyAdminKey(false),
    validateRequest(reservationValidation.create),
    createReservation
);
router.get('/', 
  verifyAdminKey(false),
  listReservationsByUser
);

router.patch('/cancel', 
  verifyAdminKey(false),
  validateRequest(reservationValidation.cancel),
  cancelReservation
);

router.patch('/', 
    verifyAdminKey(false),
    validateRequest(reservationValidation.update),
    updateReservation
);

export default router;
