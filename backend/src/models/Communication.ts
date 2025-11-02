import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import User from './User';

interface CommunicationAttributes {
  id: number;
  customerId: number;
  userId: number;
  type: 'phone' | 'email' | 'meeting' | 'note' | 'other';
  subject: string;
  content: string;
  isImportant: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommunicationCreationAttributes extends Optional<CommunicationAttributes, 'id' | 'isImportant' | 'createdAt' | 'updatedAt'> {}

class Communication extends Model<CommunicationAttributes, CommunicationCreationAttributes> implements CommunicationAttributes {
  public id!: number;
  public customerId!: number;
  public userId!: number;
  public type!: 'phone' | 'email' | 'meeting' | 'note' | 'other';
  public subject!: string;
  public content!: string;
  public isImportant!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Communication.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('phone', 'email', 'meeting', 'note', 'other'),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isImportant: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'communications',
  }
);

// Associations
Communication.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Communication.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Customer.hasMany(Communication, { foreignKey: 'customerId', as: 'communications' });

export default Communication;
