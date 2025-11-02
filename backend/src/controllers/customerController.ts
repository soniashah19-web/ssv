import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Customer from '../models/Customer';
import Communication from '../models/Communication';
import Booking from '../models/Booking';
import Invoice from '../models/Invoice';
import { Op } from 'sequelize';

export const getAllCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, paymentStatus, customerType } = req.query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { contactName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (customerType) {
      where.customerType = customerType;
    }

    const customers = await Customer.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Communication,
          as: 'communications',
          limit: 5,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    res.json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

export const getCustomerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Communication,
          as: 'communications',
          order: [['createdAt', 'DESC']],
        },
        {
          model: Booking,
          as: 'bookings',
          order: [['createdAt', 'DESC']],
        },
        {
          model: Invoice,
          as: 'invoices',
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Error fetching customer' });
  }
};

export const createCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { companyName, contactName, email, phone, address, customerType, notes } = req.body;

    const customer = await Customer.create({
      companyName,
      contactName,
      email,
      phone,
      address,
      customerType,
      notes,
    });

    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { companyName, contactName, email, phone, address, customerType, paymentStatus, outstandingBalance, notes } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update({
      companyName,
      contactName,
      email,
      phone,
      address,
      customerType,
      paymentStatus,
      outstandingBalance,
      notes,
    });

    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Error deleting customer' });
  }
};

export const getCustomerPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Invoice,
          as: 'invoices',
          where: {
            status: { [Op.in]: ['sent', 'overdue'] },
          },
          required: false,
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const canBook = customer.paymentStatus !== 'blocked';
    const warnings = [];

    if (customer.paymentStatus === 'warning') {
      warnings.push('Customer has outstanding payments');
    }

    if (customer.paymentStatus === 'blocked') {
      warnings.push('Customer is blocked due to unpaid invoices - cannot create bookings');
    }

    res.json({
      canBook,
      paymentStatus: customer.paymentStatus,
      outstandingBalance: customer.outstandingBalance,
      warnings,
      unpaidInvoices: customer.invoices,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Error checking payment status' });
  }
};
