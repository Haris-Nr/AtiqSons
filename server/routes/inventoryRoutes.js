const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");
const { addStock,getStock,uploadFile,deleteStock, editStock } = require("../controllers/inventoryCtrl");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/addstock", authMiddleware, upload.single("image"), addStock);

router.get("/stock", authMiddleware, getStock);

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

const csvUpload = multer({ storage: csvStorage });

router.post("/uploadstock", csvUpload.single("file"),uploadFile)

router.delete("/stock/:id", authMiddleware, deleteStock);




module.exports = router;