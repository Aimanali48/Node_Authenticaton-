const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const User = require('../../mongo/modal/User');
const auth = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
