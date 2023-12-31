const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,

} = require('../../controllers/thoughtController');

// /api/users
router.route('/')
.get(getThoughts)
.post(createThought);

// /api/users/:userId
router.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

// /api/users/:userId/friends/:friendId
router.route('/:thoughtId/reactions')
.post(addReaction)
.delete(deleteReaction);

module.exports = router;