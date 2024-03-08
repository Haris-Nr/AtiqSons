const Dubai = require("../models/dubaiModels");
const User = require("../models/userModel");
const { createNotification } = require("../util/notification");
const path = require("path");
const fs = require("fs").promises;

// create dubai product
const createProduct = async (req, res) => {
  try {
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

    const newFindProduct = new Dubai({ ...req.body, image: image });
    await newFindProduct.save();

    const user = await User.find(newFindProduct.createdBy);
    const io = req.app.get("io");


    if (user.role !== "admin" && user.role !== "superadmin") {
        await createNotification(
          io,
          "admin",
          null,
          `Product Find by ${user[0].fullname}`,
          "New Product",
          user[0].fullname,
          `${newFindProduct.image}`,
          `${newFindProduct.productId}`
        );
        await createNotification(
          io,
          "superadmin",
          null,
          `Product Find by ${user[0].fullname}`,
          "New Product",
          user[0].fullname,
          `${newFindProduct.image}`,
          `${newFindProduct.productId}`
        );
      } 

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const allProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Dubai.find({ productId: id }).select('-productId').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDubaiProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Dubai.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const imagePath = path.join(__dirname, '../public', product.image);

    await fs.unlink(imagePath);
    await Dubai.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product has been deleted!",
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  allProduct,
  deleteDubaiProduct
};
