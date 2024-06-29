import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Subcategory from "./subcategory.model.js";
import User from "../userModel/user.model.js";

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    stock_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subcategory,
        key: "subcategory_id",
      },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
);

Subcategory.hasMany(Product, { foreignKey: "subcategory_id" });
Product.belongsTo(Subcategory, { foreignKey: "subcategory_id" });

User.hasMany(Product, { foreignKey: "created_by" });
Product.belongsTo(User, { foreignKey: "created_by" });

export default Product;
