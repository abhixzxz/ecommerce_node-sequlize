import Role from "../models/userModel/user.role.model.js";

export const createRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    if (!role_name) {
      return res.status(400).send("Role name is required");
    }

    const newRole = await Role.create({ role_name });
    res.status(201).json({
      message: "Role create Successfully",
      status: 201,
      data: newRole,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send(`Role name ${req.body.role_name} alredy exists`);
    }
    res
      .status(500)
      .send({ error: "Could not create role", details: error.message });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({
      message: "Roles retrieved successfully",
      status: 200,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (role) {
      res.status(200).json({
        message: "Role retrieved successfully",
        status: 200,
        data: role,
      });
    } else {
      res.status(404).send("Role not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoleById = async (req, res) => {
  try {
    const { role_name } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (role) {
      role.role_name = role_name;
      await role.save();
      res.status(200).json({
        message: "Role updated successfully",
        status: 200,
        data: role,
      });
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (role) {
      await role.destroy();
      res.status(204).json({
        message: "Role deleted successfully",
        status: 204,
      });
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
