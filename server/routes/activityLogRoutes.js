const express = require('express');
const router = express.Router();
const activityLogCtrl = require('../controllers/activityLogCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, activityLogCtrl.createActivityLog);
router.get('/', authMiddleware,  activityLogCtrl.getAllActivityLogs);
router.get('/aggregated', authMiddleware, activityLogCtrl.getAggregatedActivityLogs);
router.delete('/:id', authMiddleware, activityLogCtrl.deleteActivityLog);

module.exports = router;