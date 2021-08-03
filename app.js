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
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

// Get single tour
const getSingleTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

  // If no tour found
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// Post a tour
const postTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = {
    id,
    ...req.body,
  };
  tours.push(newTour);

  // Updating the tour file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return res.status(500).json({ status: 'fail' });

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// Update a tour
const updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

  // If no tour found
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });

  const updatedTour = {
    ...tour,
    ...req.body,
  };

  // Updating the tours
  const updatedTours = tours.map((existingTour) =>
    existingTour.id === updatedTour.id ? updatedTour : existingTour
  );

  // Updating the tour file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      if (err) return res.status(500).json({ status: 'fail' });

      res.status(200).json({
        status: 'success',
        data: { tour: updatedTour },
      });
    }
  );
};

// Delete a tour
const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

  // If no tour found
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });

  // Updating the tours
  const updatedTours = tours.filter(
    (existingTour) => tour.id !== existingTour.id
  );

  // Updating the tour file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      if (err) return res.status(500).json({ status: 'fail' });

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

app.route('/api/v1/tours').get(getAllTours).post(postTour);

app
  .route('/api/v1/tours/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log('app listening on port 3000');
});
