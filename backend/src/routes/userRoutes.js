const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.use(authenticateToken);

// Trainers can view users (for member list)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Admin only routes
router.get('/stats', checkRole('admin'), userController.getUserStats);
router.post('/', checkRole('admin'), userController.createUser);
router.put('/:id', checkRole('admin'), userController.updateUser);
router.delete('/:id', checkRole('admin'), userController.deleteUser);

module.exports = router;
