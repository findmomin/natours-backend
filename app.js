const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

// Initializing app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
