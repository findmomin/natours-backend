const fs = require('fs');

// Parsing tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Get tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

// Get single tour
exports.getSingleTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// Post a tour
exports.postTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = {
    id,
    ...req.body,
  };
  tours.push(newTour);

  // Updating the tour file
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

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
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((existingTour) => existingTour.id === +id);

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
