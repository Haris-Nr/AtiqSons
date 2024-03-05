const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fianceController = require("../controllers/fianceCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Routes
router.post("/upload", upload.single("image"),authMiddleware,adminCheck, fianceController.uploadImage);
router.get("/allfianceimage",authMiddleware,adminCheck, fianceController.getAllImage);
router.delete("/delete/:id",authMiddleware,adminCheck, fianceController.deleteImage);

module.exports = router;
