import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_image: {
      type: DataTypes.STRING(255),
      allowNull: false,
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

export default Category;
