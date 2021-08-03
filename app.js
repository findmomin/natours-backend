const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.status(200).json({ hello: 'Hello' });
});

app.listen(port, () => {
  console.log('app listening on port 3000');
});
