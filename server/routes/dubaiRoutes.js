const express = require("express");
const { createProduct, allProduct } = require("../controllers/dubaiCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/adddubaiproduct", authMiddleware, createProduct);
router.get("/allproduct", authMiddleware, allProduct);


module.exports = router;
