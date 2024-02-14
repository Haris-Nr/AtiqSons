const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderCtrl');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminCheck');
const chinaEmployeeCheck = require('../middlewares/chinaEmployeeCheck');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });


router.get(
  '/',
  authMiddleware,
  orderCtrl.getOrders
);
router.post(
  '/',
  authMiddleware,
  adminCheck,
  upload.single('picture'),
  orderCtrl.createOrder
);
router.get(
  '/:id',
  orderCtrl.getOrder
);
router.put(
  '/:id',
  authMiddleware,
  upload.single('picture'),
  function (req, res, next) {

    if(req.user.role === "admin" || req.user.role === "superadmin"){
      return next();
    }

    if (
      Object.keys(req.body).length > 1 &&
      !(req.user.role === "admin" || req.user.role === "superadmin")
    ) {
      return res.status(403).json({ message: "Access denied. Only admin are allowed." });
    }

    if (
      Object.keys(req.body).length === 1 &&
      Object.keys(req.body)[0] !== "status" &&
      !(req.user.role === "admin" || req.user.role === "superadmin")
    ) {
      return res.status(403).json({ message: "Access denied. Only admin are allowed." });
    }


    
    // china employee is only allowed to update status, not other fields
    // above code will capture if china or some other user tries to update other fields

    chinaEmployeeCheck(req, res, next);
  },
  orderCtrl.updateOrder
);
router.put(
  '/:id/re-order',
  authMiddleware,
  adminCheck,
  orderCtrl.reOrder
);
router.delete(
  '/:id',
  authMiddleware,
  adminCheck,
  orderCtrl.deleteOrder
);

module.exports = router;