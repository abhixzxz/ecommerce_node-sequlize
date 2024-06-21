import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import User from "../../models/userModel/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth.controller.js";

config();

const SECRET_KEY = process.env.SECRET_KEY;

export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, phone_number, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res
        .status(400)
        .json({ error: "Name, email,role_id and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password + SECRET_KEY, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone_number,
      role_id,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Somthing went wrong try with unique values" });
    }
    res
      .status(500)
      .json({ error: "Could not create user", details: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(
    password + SECRET_KEY,
    user.password
  );
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const loginData = {
    email: user.email,
    name: user.name,
  };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(200).json({
    message: "Login successful",
    status: 200,
    data: loginData,
    accessToken,
    refreshToken,
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      message: "Users retrieved successfully",
      status: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json({
        message: "User retrieved successfully",
        status: 200,
        data: user,
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { name, email, password, address, phone_number } = req.body;
    const user = await User.findByPk(req.params.id);
    if (user) {
      if (password) {
        const hashedPassword = await bcrypt.hash(password + SECRET_KEY, 10);
        user.password = hashedPassword;
      }
      user.name = name;
      user.email = email;
      user.address = address;
      user.phone_number = phone_number;
      await user.save();
      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        data: user,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json({
        message: "User Deleted Successfully",
        status: 204,
      });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
