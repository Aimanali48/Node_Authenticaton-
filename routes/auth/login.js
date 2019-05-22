const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const key = require('../../config/keys');
const User = require('../../mongo/modal/User');

router.post(
  '/',
  [
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
    check('email', 'Please provide a valid Email').isEmail(),
    check('password', 'Password is not correct').exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ error: [{ message: 'User not found' }] });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(404).json({ error: [{ message: 'Invalid credentials' }] });
        }

        //Jwt creation
        const payload = {
          user: { id: user.id }
        };
        jwt.sign(payload, key.secretkey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
