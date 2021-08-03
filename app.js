const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const port = 3000;

// Parsing tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Get tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// Post tours
app.post('/api/v1/tours', (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = {
    id,
    ...req.body,
  };
  tours.push(newTour);

  // Updating the tour file
  console.log(newTour);
});

app.listen(port, () => {
  console.log('app listening on port 3000');
});
