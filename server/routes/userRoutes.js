const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMe, getUserProfile, listUsers, toggleFollow } = require('../controllers/userController');

router.get('/', auth, listUsers);
router.get('/me', auth, getMe);
router.get('/:id', auth, getUserProfile);
router.put('/:id/follow', auth, toggleFollow);

module.exports = router;
