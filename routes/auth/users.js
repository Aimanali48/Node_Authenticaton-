const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const User = require('../../mongo/modal/User');

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
    check('email', 'Please provide a valid Email').isEmail(),
    check('password', 'Password must be between 6 or more characters').isLength(
      { min: 6 }
    )
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ error: [{ message: 'User already exist ' }] });
      } else {
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        user = new User({
          name,
          email,
          avatar,
          password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(200).send('Registration Successful');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
