const mongoose = require('mongoose'),
  db = require('../config/keys').mongoURI;

const connection = (mongoose.Promise = global.Promise);
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('Mongodb Connected'))
  .catch(err => console.log(err));

module.exports = connection;
