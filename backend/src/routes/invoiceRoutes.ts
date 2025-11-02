import express from 'express';
import * as invoiceController from '../controllers/invoiceController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', invoiceController.getAllInvoices);
router.get('/overdue', invoiceController.getOverdueInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.patch('/:id/mark-paid', invoiceController.markInvoiceAsPaid);

export default router;
