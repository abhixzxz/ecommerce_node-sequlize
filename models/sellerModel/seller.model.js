import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const defineSellerModel = () => {
  const Seller = sequelize.define(
    "Seller",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        validate: {
          isNumeric: true,
        },
      },
      company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      gst_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      bank_details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      companyLogos: {
        type: DataTypes.JSON, // Use JSON data type
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
    }
  );

  return Seller;
};

export default defineSellerModel;
