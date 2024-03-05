const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const multer = require("multer");
const path = require("path");
const { addStock,getStock,uploadFile,deleteStock, editStock } = require("../controllers/stockCtrl");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/addstock", authMiddleware,adminCheck, upload.single("image"), addStock);

router.get("/stock", authMiddleware,adminCheck, getStock);

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

const csvUpload = multer({ storage: csvStorage });

router.post("/uploadstock",authMiddleware,adminCheck, csvUpload.single("file"),uploadFile)

router.delete("/stock/:id", authMiddleware,adminCheck, deleteStock);

router.put("/stock/:id", authMiddleware,adminCheck,upload.single("image"),editStock )



module.exports = router;