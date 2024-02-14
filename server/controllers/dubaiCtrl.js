const Dubai = require("../models/dubaiModels");

// create dubai product
const createProduct = async (req, res) => {
    try {
        const newFindProduct = new Dubai(req.body);
        await newFindProduct.save();
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
        const products = await Dubai.find().sort({ createdAt: -1 });

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

module.exports = {
    createProduct,
    allProduct,
};
