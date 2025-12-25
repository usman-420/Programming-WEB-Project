const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.use(authenticateToken);

router.get('/member', checkRole('member'), dashboardController.getMemberDashboard);
router.get('/trainer', checkRole('trainer'), dashboardController.getTrainerDashboard);
router.get('/admin', checkRole('admin'), dashboardController.getAdminDashboard);

module.exports = router;
