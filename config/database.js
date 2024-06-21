import { Sequelize } from "sequelize";
import config from "./config.js";

const env = process.env.NODE_ENV || "development";
const { database, username, password, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
});

export default sequelize;
