const Product = require("../models/productModels");
const User = require("../models/userModel");
const Track = require("../models/trackModels");
const { createNotification } = require("../util/notification");
const path = require("path");
const fs = require("fs");

// add product
const createProduct = async (req, res) => {
  try {
    // find product by asin NO
    const findproduct = await Product.findOne({ asin: req.body.asin });
    if (findproduct) {
      throw new Error("Product already in product list");
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
    const newProduct = new Product({
      ...req.body,
      image: image,
    });

    await newProduct.save();

    const user = await User.find(newProduct.createdBy);

    const io = req.app.get("io");

    if (user.role !== "admin" && user.role !== "superadmin") {
      await createNotification(
        io,
        "admin",
        null,
        `New product added by ${user[0].fullname}`,
        "New Product",
        user[0].fullname,
        `${newProduct.image}`,
        `${newProduct._id}`
      );
      await createNotification(
        io,
        "superadmin",
        null,
        `New product added by ${user[0].fullname}`,
        "New Product",
        user[0].fullname,
        `${newProduct.image}`,
        `${newProduct._id}`
      );
    } else if (user.role === "admin") {
      await createNotification(
        io,
        "superadmin",
        null,
        `New product added by ${user[0].fullname}`,
        "New Product",
        user[0].fullname,
        `${newProduct.image}`,
        `${newProduct._id}`
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

//fetch all products by specific employee
const fetchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const search = req.query.search;
    
    if (!req.body.createdBy) {
      throw new Error("Creator ID (createdBy) must be provided");
    }

    let query = { createdBy: req.body.createdBy };

    if (search) {
      query = {
        createdBy: req.body.createdBy,
        $or: [
          { productName: { $regex: search, $options: "i" } },
          { asin: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { trackProgress: { $regex: search, $options: "i" } }
        ]
      };
    }

    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("image productName asin status tracking")
      .exec();

    res.status(200).json({
      data: products,
      totalItems: totalCount,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      search:search
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// all products
const allProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let queryObj = {};
    if (search) {
      queryObj = {
        $or: [
          { productName: { $regex: search, $options: "i" } },
          { seller: { $regex: search, $options: "i" } },
          { asin: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { trackProgress: { $regex: search, $options: "i" } }
        ]
      };
    }
    const products = await Product.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("image productName seller asin status tracking")
      .exec();

      const totalProduct = await Product.countDocuments(queryObj);
      const totalPages = Math.ceil(totalProduct / limit);

    res.status(200).json({
      data: products,
      page:page,
      limit:limit,
      totalProduct:totalProduct,
      totalPages: totalPages,
      search:search
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.image) {
      const filePath = path.join(__dirname, "../public", product.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
    }

    await Product.findByIdAndDelete(id);

    const user = await User.findById(req.body.userId);

    console.log(product)

    const io = req.app.get("io");

    if (user.role !== "admin" && user.role !== "superadmin") {
      await createNotification(
        io,
        "admin",
        null,
        `${product.productName.slice(0,20)} deleted`,
        `${user.fullname} deleted this Product`,
        user.fullname,
        `${product.image}`,
        `..`
      );
      await createNotification(
        io,
        "superadmin",
        null,
        `${product.productName.slice(0,20)} deleted`,
        `${user.fullname} deleted this Product`,
        user.fullname,
        `${product.image}`,
        `..`
      );
    } else if (user.role === "admin") {
      await createNotification(
        io,
        "superadmin",
        null,
        `${product.productName.slice(0,20)} deleted`,
        `${user.fullname} deleted this Product`,
        user.fullname,
        `${product.image}`,
        `..`
      );
    }

    res.status(200).json({
      success: true,
      message: "Product has been deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update the existing product by id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* change product status */
const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      status,
    }, { new: true });

    const user = await User.findById(req.body.userId);

    const io = req.app.get("io");

    await createNotification(
      io,
      null,
      updatedProduct.createdBy,
      `${updatedProduct.productName.slice(0,20)} has been ${status} by ${user.fullname}`,
      "Product Status Updated",
      user.fullname,
      `${updatedProduct.image}`,
      `${updatedProduct._id}`
    );

    if (user.role === 'admin' && updatedProduct.createdBy !== user._id) {
      await createNotification(
        io,
        "superadmin",
        null,
        `${updatedProduct.productName.slice(0,20)} status changed to ${status} by ${user.fullname}`,
        "Product Status Updated",
        user.fullname,
        `${updatedProduct.image}`,
        `${updatedProduct._id}`
      );
    }

    res.json({
      success: true,
      message: "Product status updated successfully",
    });
  } catch (error) {
    res.json({
      succuess: false,
      message: error.message,
    });
  }
};

/* Get a single product by id */
const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      data: product,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// change track status
const changeTrackStatus = async (req, res) => {
  try {
    const { tracking } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      tracking,
    });

    const admin = await User.findById(req.body.userId);
    const io = req.app.get("io");
    await createNotification(
      io,
      null,
      updatedProduct.createdBy,
      `${updatedProduct.productName} add in ${tracking} state by ${admin.fullname}`,
      "Product Status Updated",
      admin.fullname,
      `${updatedProduct.image}`,
      `${updatedProduct._id}`
    );

    if (admin.role === 'admin' && updatedProduct.createdBy !== admin._id) {
      await createNotification(
        io,
        "superadmin",
        null,
        `${updatedProduct.productName} add in ${tracking} state by ${admin.fullname}`,
        "Product Status Updated",
        admin.fullname,
        `${updatedProduct.image}`,
        `${updatedProduct._id}`
      );
    }
    res.json({
      success: true,
      message: "Product Tracking Start successfully",
    });
  } catch (error) {
    res.json({
      succuess: false,
      message: error.message,
    });
  }
};

// track product
const trackProduct = async (req, res) => {
  try {
    const newTrack = new Track(req.body);

    await newTrack.save();

    res.status(201).json({
      success: true,
      message: "Track",
    });
  } catch (error) {
    res.status(500).json({
      succuess: false,
      message: error.message,
    });
  }
};

// gettrackproduct
const gettrackproduct = async (req, res) => {
  try {
    const id = req.params.id;

    const trackProduct = await Track.find({ productId: id });

    res.json({
      success: true,
      data: trackProduct,
    });
  } catch (error) {
    res.json({
      succuess: false,
      message: error.message,
    });
  }
};

const getIntrackingProduct = async (req, res) => {
  try {
    if (!req.body.createdBy) {
      throw new Error("Creator ID (createdBy) must be provided");
    }

    const query = {
      createdBy: req.body.createdBy,
      tracking: "tracking",
    };

    const trackingProducts = await Product.find(query)
      .populate("createdBy")
      .sort({ createdAt: -1 });

    if (!trackingProducts.length) {
      throw new Error("No tracking products found");
    }

    res.json({
      success: true,
      data: trackingProducts,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Dubai products
const DubaiProduct = async (req, res) => {
  try {
    const products = await Product.find({ status: 'approved' }).sort({ createdAt: -1 });
    console.log(products)
  
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }  
};

module.exports = {
  createProduct,
  fetchProducts,
  deleteProduct,
  updateProduct,
  changeStatus,
  singleProduct,
  allProduct,
  changeTrackStatus,
  trackProduct,
  getIntrackingProduct,
  gettrackproduct,
  DubaiProduct,
};
