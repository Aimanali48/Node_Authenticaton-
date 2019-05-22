const express = require('express'),
  app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: false }));
app.use('/api/users', require('./routes/auth/users'));
app.use('/api/auth', require('./routes/auth/login'));
app.use('/api/test', require('./routes/protected/test'));
app.use(require('./mongo/db'));

app.listen(PORT, () => {
  console.log('server started');
});
