import express from "express";
import sequelize from "./config/database.js";
import userRoutes from "./routes/userRoutes/user.routes.js";
import userRole from "./routes/userRoutes/role.routes.js";
import productRoutes from "./routes/product.routes.js";
import refreshTokenRoutes from "./routes/auth.refreshToken.routes.js";
import imageRoutes from "./routes/image.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser"; // Import cookie-parser

import { config } from "dotenv";

const app = express();
config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to sync database:", error);
  });

app.use("/api/users", userRoutes);
app.use("/api/token", refreshTokenRoutes);
app.use("/api/userRole", userRole);
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/cart", cartRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
