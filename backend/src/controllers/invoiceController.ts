import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Invoice from '../models/Invoice';
import Customer from '../models/Customer';
import Booking from '../models/Booking';
import { Op } from 'sequelize';

export const getAllInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { status, customerId } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const invoices = await Invoice.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName', 'email'],
        },
        {
          model: Booking,
          as: 'booking',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
        {
          model: Booking,
          as: 'booking',
          required: false,
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Error fetching invoice' });
  }
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { invoiceNumber, customerId, bookingId, issueDate, dueDate, amount, description } = req.body;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      customerId,
      bookingId,
      issueDate,
      dueDate,
      amount,
      description,
      status: 'draft',
    });

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
};

export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { invoiceNumber, issueDate, dueDate, amount, paidAmount, status, description } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await invoice.update({
      invoiceNumber,
      issueDate,
      dueDate,
      amount,
      paidAmount,
      status,
      description,
    });

    // Update customer payment status and outstanding balance
    const customer = await Customer.findByPk(invoice.customerId);
    if (customer) {
      const unpaidInvoices = await Invoice.findAll({
        where: {
          customerId: customer.id,
          status: { [Op.in]: ['sent', 'overdue'] },
        },
      });

      const totalOutstanding = unpaidInvoices.reduce((sum, inv) => {
        return sum + (parseFloat(inv.amount.toString()) - parseFloat(inv.paidAmount.toString()));
      }, 0);

      let paymentStatus: 'good' | 'warning' | 'blocked' = 'good';
      if (totalOutstanding > 0 && totalOutstanding <= 1000) {
        paymentStatus = 'warning';
      } else if (totalOutstanding > 1000) {
        paymentStatus = 'blocked';
      }

      await customer.update({
        outstandingBalance: totalOutstanding,
        paymentStatus,
      });
    }

    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Error updating invoice' });
  }
};

export const markInvoiceAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { paidAmount } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const finalPaidAmount = paidAmount || invoice.amount;

    await invoice.update({
      paidAmount: finalPaidAmount,
      status: parseFloat(finalPaidAmount.toString()) >= parseFloat(invoice.amount.toString()) ? 'paid' : 'sent',
    });

    // Update customer payment status
    const customer = await Customer.findByPk(invoice.customerId);
    if (customer) {
      const unpaidInvoices = await Invoice.findAll({
        where: {
          customerId: customer.id,
          status: { [Op.in]: ['sent', 'overdue'] },
        },
      });

      const totalOutstanding = unpaidInvoices.reduce((sum, inv) => {
        return sum + (parseFloat(inv.amount.toString()) - parseFloat(inv.paidAmount.toString()));
      }, 0);

      let paymentStatus: 'good' | 'warning' | 'blocked' = 'good';
      if (totalOutstanding > 0 && totalOutstanding <= 1000) {
        paymentStatus = 'warning';
      } else if (totalOutstanding > 1000) {
        paymentStatus = 'blocked';
      }

      await customer.update({
        outstandingBalance: totalOutstanding,
        paymentStatus,
      });
    }

    res.json({ message: 'Invoice payment recorded successfully', invoice });
  } catch (error) {
    console.error('Mark invoice as paid error:', error);
    res.status(500).json({ message: 'Error recording payment' });
  }
};

export const getOverdueInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const overdueInvoices = await Invoice.findAll({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.in]: ['sent', 'overdue'] },
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName', 'email', 'phone'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    // Update status to overdue if not already
    for (const invoice of overdueInvoices) {
      if (invoice.status !== 'overdue') {
        await invoice.update({ status: 'overdue' });
      }
    }

    res.json({ invoices: overdueInvoices });
  } catch (error) {
    console.error('Get overdue invoices error:', error);
    res.status(500).json({ message: 'Error fetching overdue invoices' });
  }
};
