import express from 'express';
import * as communicationController from '../controllers/communicationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', communicationController.getAllCommunications);
router.get('/recent', communicationController.getRecentCommunications);
router.get('/:id', communicationController.getCommunicationById);
router.post('/', communicationController.createCommunication);
router.put('/:id', communicationController.updateCommunication);
router.delete('/:id', communicationController.deleteCommunication);

export default router;
