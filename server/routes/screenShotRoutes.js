const {
    getAllScreenShots,
    createScreenShot,
    deleteScreenShot
} = require('../controllers/screenShotCtrl');

const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminCheck');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + '.png');
    },
});

const upload = multer({ storage: storage });


router.post('/create', authMiddleware, adminCheck, upload.single('screenShot'), createScreenShot);
router.get('/all', authMiddleware, adminCheck, getAllScreenShots);
router.delete('/delete/:id', authMiddleware, adminCheck, deleteScreenShot);


module.exports = router;