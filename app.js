const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

// Initializing app
const app = express();

const port = 3000;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
  console.log('app listening on port 3000');
});
