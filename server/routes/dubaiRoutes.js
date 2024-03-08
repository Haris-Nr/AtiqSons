const express = require("express");
const { createProduct, allProduct, deleteDubaiProduct } = require("../controllers/dubaiCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post(
    "/adddubaiproduct",
    authMiddleware,
    upload.single("image"),
    createProduct
);
router.get("/allproduct/:id", authMiddleware, allProduct);
router.delete("/deleteproduct/:id", authMiddleware, deleteDubaiProduct);

module.exports = router;
