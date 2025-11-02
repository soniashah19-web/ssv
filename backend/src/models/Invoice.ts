import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Booking from './Booking';

interface InvoiceAttributes {
  id: number;
  invoiceNumber: string;
  customerId: number;
  bookingId?: number;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'bookingId' | 'paidAmount' | 'status' | 'description' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public customerId!: number;
  public bookingId?: number;
  public issueDate!: Date;
  public dueDate!: Date;
  public amount!: number;
  public paidAmount!: number;
  public status!: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'invoices',
  }
);

// Associations
Invoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Invoice.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
Customer.hasMany(Invoice, { foreignKey: 'customerId', as: 'invoices' });

export default Invoice;
