const express = require('express');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const connectDB = require('./db/mongoose');
const taskRouter = require('./routers/task');
const headingRouter = require('./routers/heading');

const { PORT, URL } = require('./config/config');
const helpers = require('./config/helpers');
const errors = require('./config/errors');

const app = express();

app.engine('hbs', expressHbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: helpers
}));

app.set('view engine', 'hbs');
app.use('/static', express.static('static'));
app.use('/alien', express.static('alien'));

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(taskRouter);
app.use(headingRouter);

app.use(errors.errorGeneration404);
app.use(errors.errorHandling);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${ PORT }, url: ${ URL }`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
