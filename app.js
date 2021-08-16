const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');
const viewRouter = require('./routers/viewRoutes');
const AppError = require('./utils/appError');

// Initializing app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
const limiter = rateLimit({
  max: (60 * 60) / 2,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(helmet());
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use(express.static(`${__dirname}/public`));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

////////////////////// API routes
// Mounting routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

/////////////////////// Client page routes
app.get('/', (req, res) => res.status(200).render('overview'));

const a = `
footer.footer
  .footer__logo
    img(src='img/logo-green.png' alt='Natours logo')
  ul.footer__nav
    li
      a(href='#') About us
    li
      a(href='#') Download apps
    li
      a(href='#') Become a guide
    li
      a(href='#') Careers
    li
      a(href='#') Contact
  p.footer__copyright
    | &copy; by Jonas Schmedtmann. All rights reserved.

`;

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
