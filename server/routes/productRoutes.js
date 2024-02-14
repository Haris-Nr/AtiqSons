const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const {
  createProduct,
  deleteProduct,
  fetchProducts,
  changeStatus,
  singleProduct,
  allProduct,
  trackProduct,
  changeTrackStatus,
  getIntrackingProduct,
  gettrackproduct,
  DubaiProduct,
} = require("../controllers/productCtrl");
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
  "/addproduct",
  authMiddleware,
  upload.single("image"),
  createProduct
);
router.post("/fetchProductsbyemployee", authMiddleware, fetchProducts);

router.delete("/deleteproduct/:id", authMiddleware, deleteProduct);

router.get("/fetchSingleProduct/:id", authMiddleware, singleProduct);

router.patch(
  "/changeProductStatus/:id",
  authMiddleware,
  adminCheck,
  changeStatus
);

router.get("/fetchallProduct", authMiddleware, adminCheck, allProduct);

router.post("/trackProduct", authMiddleware, trackProduct);

router.get("/gettrackProduct/:id", authMiddleware, gettrackproduct);

router.patch(
  "/changeTrackStatus/:id",
  authMiddleware,
  adminCheck,
  changeTrackStatus
);

router.post("/intrackingProduct", authMiddleware, getIntrackingProduct);

router.get("/dubaiproduct", authMiddleware, DubaiProduct);

module.exports = router;
