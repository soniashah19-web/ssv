import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CustomerAttributes {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  customerType: 'serviced_office' | 'virtual_office' | 'meeting_room' | 'mixed';
  paymentStatus: 'good' | 'warning' | 'blocked';
  outstandingBalance: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'address' | 'notes' | 'outstandingBalance' | 'paymentStatus' | 'createdAt' | 'updatedAt'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: number;
  public companyName!: string;
  public contactName!: string;
  public email!: string;
  public phone!: string;
  public address?: string;
  public customerType!: 'serviced_office' | 'virtual_office' | 'meeting_room' | 'mixed';
  public paymentStatus!: 'good' | 'warning' | 'blocked';
  public outstandingBalance!: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    customerType: {
      type: DataTypes.ENUM('serviced_office', 'virtual_office', 'meeting_room', 'mixed'),
      allowNull: false,
      defaultValue: 'meeting_room',
    },
    paymentStatus: {
      type: DataTypes.ENUM('good', 'warning', 'blocked'),
      allowNull: false,
      defaultValue: 'good',
    },
    outstandingBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'customers',
  }
);

export default Customer;
