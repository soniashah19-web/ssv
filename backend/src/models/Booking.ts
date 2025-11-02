import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import User from './User';

interface BookingAttributes {
  id: number;
  customerId: number;
  bookingType: 'serviced_office' | 'virtual_office' | 'meeting_room_hourly' | 'meeting_room_daily';
  resourceName: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  isPaid: boolean;
  notes?: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status' | 'isPaid' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public customerId!: number;
  public bookingType!: 'serviced_office' | 'virtual_office' | 'meeting_room_hourly' | 'meeting_room_daily';
  public resourceName!: string;
  public startDate!: Date;
  public endDate!: Date;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public totalAmount!: number;
  public isPaid!: boolean;
  public notes?: string;
  public createdBy!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    bookingType: {
      type: DataTypes.ENUM('serviced_office', 'virtual_office', 'meeting_room_hourly', 'meeting_room_daily'),
      allowNull: false,
    },
    resourceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'bookings',
  }
);

// Associations
Booking.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Booking.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Customer.hasMany(Booking, { foreignKey: 'customerId', as: 'bookings' });

export default Booking;
