import Image from "../models/image.model.js";

export const uploadImage = async (req, res) => {
  try {
    const image = await Image.create({
      name: req.file.originalname,
      url: req.file.path,
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
