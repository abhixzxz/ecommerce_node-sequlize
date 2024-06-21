import Subcategory from "../../models/productModel/subcategory.model.js";

export const createSubcategory = async (req, res) => {
  try {
    const { subcategory_name, category_id } = req.body;
    if (!subcategory_name || !category_id) {
      return res
        .status(400)
        .json({ error: "Subcategory name and category ID are required" });
    }

    const subcategory = await Subcategory.create({
      subcategory_name,
      category_id,
    });
    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the subcategory" });
  }
};

export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll();
    res.status(200).json(subcategories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the subcategories" });
  }
};
