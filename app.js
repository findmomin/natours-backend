const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');
const AppError = require('./utils/appError');

// Initializing app
const app = express();

// Middleware
const limiter = rateLimit({
  max: (60 * 60) / 2,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(helmet());
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) =>
  next(new AppError(`can't find ${req.originalUrl} on the server!`, 404))
);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next();
});

module.exports = app;
