const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Injecting env vars
dotenv.config({ path: './config.env' });

// Connecting to mongoDB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB Successfully'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on port 3000');
});
