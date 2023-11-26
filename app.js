const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const bodyParser = require('body-parser');

require('dotenv').config();

const { PORT, URL, MONGO_URL } = require('./config/app.conf');

const connectDB = require('./db/connect');
const helpers = require('./utils/helpers.util');

const notFoundMiddleware = require('./middleware/not-found.middleware');
const errorHandlerMiddleware = require('./middleware/error-handler.middleware');

const app = express();

app.engine(
  'hbs',
  expressHbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers,
  }),
);

app.set('view engine', 'hbs');
app.use('/static', express.static('static'));

hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use('/heading', require('./routes/heading.route'));
app.use('/schedule', require('./routes/schedule.route'));
app.use('/settings', require('./routes/settings.route'));
app.use('/', require('./routes/task.route'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}, url: ${URL}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
