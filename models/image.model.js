import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Image = sequelize.define("Image", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Image;
