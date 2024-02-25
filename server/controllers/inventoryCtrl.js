const Inventory = require("../models/inventoryModel");
const csvtojson = require("csvtojson");
const fs = require('fs');

const addStock = async (req, res) => {
  try {
    const findproduct = await Inventory.findOne({ asin: req.body.asin });
    if (findproduct) {
      throw new Error("Already in stock");
    }

    let image = "";
    if (req.file) {
      image = req.file.path;
      image =
        "/" +
        image
          .replace(/\\/g, "/")
          .split("/")
          .filter((e) => e && e !== "public")
          .join("/");
    }

    const newStock = new Inventory({
      ...req.body,
      image: image,
    });

    await newStock.save();

    res.status(201).json({
      success: true,
      message: "Stock add",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStock = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search
      ? {
          productName: { $regex: req.query.search, $options: "i" },
        }
      : {};

    const stockItems = await Inventory.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inventory.countDocuments(searchQuery);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages,
      totalItems: total,
      data: stockItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadFile = async (req, res) => {
  try {
    console.log(req.file)
    if (!req.file) {
      throw new Error("File not found")
    }

    let jsonArray = await csvtojson().fromFile(req.file.path);
    jsonArray = jsonArray.map(({ SRno, ...rest }) => rest);

    await Inventory.insertMany(jsonArray);

    fs.unlink(req.file.path);

    res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock item deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editStock = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await Inventory.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Stock item not found.',
      });
    }

    const updatedData = req.body;

    if (req.file) {
      if (existingItem.image) {
        const existingImagePath = existingItem.image;
        fs.unlink(path.resolve(existingImagePath), (err) => {
          if (err) {
            throw new Error(err.message)
            console.error("Failed to delete old image:", err);
          }
        });
      }
      updatedData.image = req.file.path;
    }

    await Inventory.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Stock item updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStock,
  getStock,
  uploadFile,
  deleteStock,
  editStock,
};
