const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.use(authenticateToken);

router.get('/', checkRole('admin', 'trainer'), membershipController.getAllMemberships);
router.get('/revenue', checkRole('admin'), membershipController.getRevenueStats);
router.get('/user/:userId?', membershipController.getUserMemberships);
router.get('/active/:userId?', membershipController.getActiveMembership);
router.get('/:id', membershipController.getMembershipById);

// Only admins can create/update/delete memberships
router.post('/', checkRole('admin'), membershipController.createMembership);
router.put('/:id', checkRole('admin'), membershipController.updateMembership);
router.delete('/:id', checkRole('admin'), membershipController.deleteMembership);

module.exports = router;
