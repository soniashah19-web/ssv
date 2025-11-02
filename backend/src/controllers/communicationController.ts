import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Communication from '../models/Communication';
import Customer from '../models/Customer';
import User from '../models/User';

export const getAllCommunications = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, type, isImportant } = req.query;

    const where: any = {};

    if (customerId) {
      where.customerId = customerId;
    }

    if (type) {
      where.type = type;
    }

    if (isImportant !== undefined) {
      where.isImportant = isImportant === 'true';
    }

    const communications = await Communication.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ communications });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({ message: 'Error fetching communications' });
  }
};

export const getCommunicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const communication = await Communication.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    res.json({ communication });
  } catch (error) {
    console.error('Get communication error:', error);
    res.status(500).json({ message: 'Error fetching communication' });
  }
};

export const createCommunication = async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, type, subject, content, isImportant } = req.body;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const communication = await Communication.create({
      customerId,
      userId: req.user!.id,
      type,
      subject,
      content,
      isImportant: isImportant || false,
    });

    const createdCommunication = await Communication.findByPk(communication.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    res.status(201).json({ message: 'Communication logged successfully', communication: createdCommunication });
  } catch (error) {
    console.error('Create communication error:', error);
    res.status(500).json({ message: 'Error logging communication' });
  }
};

export const updateCommunication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, subject, content, isImportant } = req.body;

    const communication = await Communication.findByPk(id);

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    await communication.update({
      type,
      subject,
      content,
      isImportant,
    });

    res.json({ message: 'Communication updated successfully', communication });
  } catch (error) {
    console.error('Update communication error:', error);
    res.status(500).json({ message: 'Error updating communication' });
  }
};

export const deleteCommunication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const communication = await Communication.findByPk(id);

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    await communication.destroy();

    res.json({ message: 'Communication deleted successfully' });
  } catch (error) {
    console.error('Delete communication error:', error);
    res.status(500).json({ message: 'Error deleting communication' });
  }
};

export const getRecentCommunications = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const communications = await Communication.findAll({
      limit,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'companyName', 'contactName'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ communications });
  } catch (error) {
    console.error('Get recent communications error:', error);
    res.status(500).json({ message: 'Error fetching recent communications' });
  }
};
