const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { listPosts, createPost, deletePost, toggleLike, addComment } = require('../controllers/postController');

router.get('/', listPosts);
router.post('/', auth, upload.single('image'), createPost);
router.delete('/:id', auth, deletePost);
router.put('/like/:id', auth, toggleLike);
router.post('/:id/comments', auth, addComment);

module.exports = router;
