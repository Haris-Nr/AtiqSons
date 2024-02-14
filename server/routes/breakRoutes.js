const express = require('express');
const { 
    createBreak, 
    getAllBreaks,
    approveBreak,
    rejectBreak 
} = require('../controllers/breakCtrl')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.get(
    '/', 
    authMiddleware,
    getAllBreaks
)
router.post(
    '/',
    authMiddleware, 
    createBreak
)
router.put(
    '/:id/approve',
    authMiddleware, 
    approveBreak
)
router.put(
    '/:id/reject',
    authMiddleware, 
    rejectBreak
)

module.exports = router;
