const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const { productInfo } = require("../controllers/statsCtrl");

router.get('/', authMiddleware,adminCheck, productInfo);

module.exports = router;