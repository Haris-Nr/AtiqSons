const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminCheck = require("../middlewares/adminCheck");
const {
  addFlex,
  getAllFlex,
  deleteFlex,
  updateFlex,
} = require("../controllers/flexCtrl");

// Route to add a new Flex entry
router.post("/flex", authMiddleware, adminCheck, addFlex);

// Route to get all Flex entries
router.get("/flex", authMiddleware, adminCheck, getAllFlex);

// Route to delete a Flex entry
router.delete("/flex/:id", authMiddleware, adminCheck, deleteFlex);

// Route to update a Flex entry
router.put("/flex/:id", authMiddleware, adminCheck, updateFlex);

module.exports = router;
