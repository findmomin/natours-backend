const fs = require('fs');
const Tour = require('./models/tourModel');

exports.uploadToursDataToDb = async () => {
  try {
    // Reading file from storage
    const tours = JSON.parse(
      fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
    ).map((tour) => {
      delete tour.id;

      return tour;
    });

    // Uploading to db
    await Tour.create(tours);
  } catch (err) {
    console.log(err);
  }
};
