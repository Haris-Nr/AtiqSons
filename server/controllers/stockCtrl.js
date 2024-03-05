const Stock = require("../models/stockModel");
const csvtojson = require("csvtojson");
const fs = require("fs");
const xlsx = require('xlsx');
const path = require("path");

const addStock = async (req, res) => {
  try {
    const findproduct = await Stock.findOne({ asin: req.body.asin });
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

    const newStock = new Stock({
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
          $or: [
            { productName: { $regex: req.query.search, $options: "i" } },
            { sku: { $regex: req.query.search, $options: "i" } },
            { asin: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const stockItems = await Stock.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Stock.countDocuments(searchQuery);

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
    if (!req.file) {
      throw new Error("File not found");
    }

    let jsonArray = [];
    if (req.file.originalname.endsWith('.csv')) {
      jsonArray = await csvtojson().fromFile(req.file.path);
    } else if (req.file.originalname.endsWith('.xlsx')) {
      const workbook = xlsx.readFile(req.file.path);
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        jsonArray.push(...data);
      });
    } else {
      throw new Error("Unsupported file format");
    }

    await Stock.insertMany(jsonArray);

    const filePath = path.join(__dirname, "..", req.file.path);

    await fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
      console.log("File deleted successfully");
    });

    res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Stock.findByIdAndDelete(id);

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
    const updatedData = req.body;

    const existingItem = await Stock.findById(id);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found.",
      });
    }

    if (req.file) {
      const imagePath = req.file.path;
      const relativeImagePath =
        "/" +
        imagePath
          .replace(/\\/g, "/")
          .split("/")
          .filter((e) => e && e !== "public")
          .join("/");

      updatedData.image = relativeImagePath;

      // Delete the old image if it exists
      if (existingItem.image) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          existingItem.image
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error(`Failed to delete old image: ${error.message}`);
        }
      }
    }

    await Stock.findByIdAndUpdate(id, updatedData, {
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
