const jwt = require('jsonwebtoken');
const key = require('../config/keys');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401).json({ message: 'No token, Autjorization denied' });
  }
  try {
    const decoded = jwt.verify(token, key.secretkey);
    if (decoded) {
      req.user = decoded.user;
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
