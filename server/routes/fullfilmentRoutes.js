const express = require("express");
const router = express.Router();
const fullfilmentController = require("../controllers/fullfilmentCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
// Create a new fullfilment
router.post(
  "/fullfilments",
  authMiddleware,
  fullfilmentController.createFullfilment
);

// Get all fullfilments
router.get(
  "/fullfilments",
  authMiddleware,
  fullfilmentController.getAllFullfilments
);

// Update a fullfilment
router.put(
  "/fullfilments/:id",
  authMiddleware,
  fullfilmentController.updateFullfilment
);

// Delete a fullfilment
router.delete(
  "/fullfilments/:id",
  authMiddleware,
  fullfilmentController.deleteFullfilment
);

module.exports = router;
