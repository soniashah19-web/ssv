import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Booking from '../models/Booking';
import Customer from '../models/Customer';
import User from '../models/User';
import { Op } from 'sequelize';

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, bookingType, startDate, endDate } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (bookingType) {
      where.bookingType = bookingType;
    }

    if (startDate && endDate) {
      where.startDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName', 'paymentStatus'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['startDate', 'DESC']],
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, bookingType, resourceName, startDate, endDate, totalAmount, notes } = req.body;

    // Check customer payment status before creating booking
    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.paymentStatus === 'blocked') {
      return res.status(403).json({
        message: 'Cannot create booking - customer has outstanding payments and is blocked',
        paymentStatus: customer.paymentStatus,
        outstandingBalance: customer.outstandingBalance,
      });
    }

    const booking = await Booking.create({
      customerId,
      bookingType,
      resourceName,
      startDate,
      endDate,
      totalAmount,
      notes,
      createdBy: req.user!.id,
    });

    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    // Add warning if customer has payment warning status
    const response: any = {
      message: 'Booking created successfully',
      booking: createdBooking,
    };

    if (customer.paymentStatus === 'warning') {
      response.warning = 'Customer has outstanding payments - please follow up';
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const updateBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { bookingType, resourceName, startDate, endDate, status, totalAmount, isPaid, notes } = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({
      bookingType,
      resourceName,
      startDate,
      endDate,
      status,
      totalAmount,
      isPaid,
      notes,
    });

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
      ],
    });

    res.json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({ status: 'cancelled' });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};
