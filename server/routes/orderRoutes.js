const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderCtrl');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminCheck');

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

    if(req.user.dashboard === "china"){
      return next();
    }

    res.status(401).json({ message: "You are not allowed to update this order" });
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