import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import User from "../../models/userModel/user.model.js";
import Address from "../../models/userModel/address.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth.controller.js";

config();

const SECRET_KEY = process.env.SECRET_KEY;

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      addresses,
      phone_number,
      role_id,
    } = req.body;

    if (!name || !email || !password || !role_id || !gender || !dob) {
      return res.status(400).json({
        error: "Name, email, password, role_id, gender, and dob are required",
      });
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
      gender,
      dob,
      phone_number,
      role_id,
      addresses,
    });

    if (addresses && addresses.length > 0) {
      for (const address of addresses) {
        await Address.create({
          user_id: newUser.id,
          ...address,
        });
      }
    }

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
        .json({ error: "Something went wrong, try with unique values" });
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
    const users = await User.findAll({
      include: Address, // Include addresses in the response
    });
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
    const user = await User.findByPk(req.params.id, {
      include: Address, // Include addresses in the response
    });
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
    const { name, email, password, addresses, phone_number } = req.body;
    const user = await User.findByPk(req.params.id);
    if (user) {
      if (password) {
        const hashedPassword = await bcrypt.hash(password + SECRET_KEY, 10);
        user.password = hashedPassword;
      }
      user.name = name;
      user.email = email;
      user.phone_number = phone_number;
      await user.save();

      // Handle addresses
      if (addresses && addresses.length > 0) {
        await Address.destroy({ where: { user_id: user.id } }); // Remove existing addresses
        for (const address of addresses) {
          await Address.create({
            user_id: user.id,
            ...address,
          });
        }
      }

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
      await Address.destroy({ where: { user_id: user.id } }); // Remove addresses associated with the user
      await user.destroy();
      res.status(204).json({
        message: "User deleted successfully",
        status: 204,
      });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
