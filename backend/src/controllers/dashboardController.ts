import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Customer from '../models/Customer';
import Booking from '../models/Booking';
import Invoice from '../models/Invoice';
import Communication from '../models/Communication';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get total customers
    const totalCustomers = await Customer.count();

    // Get customers by payment status
    const customersWithWarnings = await Customer.count({
      where: { paymentStatus: 'warning' },
    });

    const blockedCustomers = await Customer.count({
      where: { paymentStatus: 'blocked' },
    });

    // Get total outstanding balance
    const customers = await Customer.findAll({
      attributes: ['outstandingBalance'],
    });
    const totalOutstandingBalance = customers.reduce((sum, customer) => {
      return sum + parseFloat(customer.outstandingBalance.toString());
    }, 0);

    // Get active bookings (upcoming and confirmed)
    const today = new Date();
    const activeBookings = await Booking.count({
      where: {
        startDate: { [Op.gte]: today },
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
    });

    // Get bookings this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const bookingsThisMonth = await Booking.count({
      where: {
        startDate: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    // Get overdue invoices
    const overdueInvoices = await Invoice.count({
      where: {
        dueDate: { [Op.lt]: today },
        status: { [Op.in]: ['sent', 'overdue'] },
      },
    });

    // Get unpaid invoices
    const unpaidInvoices = await Invoice.count({
      where: {
        status: { [Op.in]: ['sent', 'overdue'] },
      },
    });

    // Get recent communications
    const recentCommunications = await Communication.findAll({
      limit: 5,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Get upcoming bookings
    const upcomingBookings = await Booking.findAll({
      where: {
        startDate: { [Op.gte]: today },
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
      limit: 5,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName', 'paymentStatus'],
        },
      ],
      order: [['startDate', 'ASC']],
    });

    // Get customers needing attention (blocked or with warnings)
    const customersNeedingAttention = await Customer.findAll({
      where: {
        paymentStatus: { [Op.in]: ['warning', 'blocked'] },
      },
      limit: 10,
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
      order: [['outstandingBalance', 'DESC']],
    });

    res.json({
      stats: {
        totalCustomers,
        customersWithWarnings,
        blockedCustomers,
        totalOutstandingBalance: totalOutstandingBalance.toFixed(2),
        activeBookings,
        bookingsThisMonth,
        overdueInvoices,
        unpaidInvoices,
      },
      recentCommunications,
      upcomingBookings,
      customersNeedingAttention,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
