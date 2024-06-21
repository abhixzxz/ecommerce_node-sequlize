import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Category from "./category.model.js";

const Subcategory = sequelize.define(
  "Subcategory",
  {
    subcategory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subcategory_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "category_id",
      },
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

Category.hasMany(Subcategory, { foreignKey: "category_id" });
Subcategory.belongsTo(Category, { foreignKey: "category_id" });

export default Subcategory;
