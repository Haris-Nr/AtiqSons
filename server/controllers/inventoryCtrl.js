const Inventory = require("../models/inventoryModel");
const csvtojson = require("csvtojson");

const addStock = async (req, res) => {
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
      productName: { $regex: req.query.search, $options: 'i' },
      }
    : {};

    const stockItems = await Inventory.find(searchQuery)
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
}

const uploadFile = async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    let jsonArray = await csvtojson().fromFile(req.file.path);
    jsonArray = jsonArray.map(({ SRno, ...rest }) => rest);
    await Inventory.insertMany(jsonArray);

    // for (const item of jsonArray) {
    //   try {
    //     await new Inventory(item).save();
    //   } catch (error) {
    //     if (error.code === 11000) {
    //       console.log(`Skipping duplicate item: ${item.asin}`);
    //       continue;
    //     } else {
    //       throw error; 
    //     }
    //   }
    // }

    res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addStock,
  getStock,
  uploadFile,
};
