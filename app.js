const express = require('express');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const moment = require('moment');

const connectDB = require('./db/mongoose');
const taskRouter = require('./routers/task');

const { PORT, URL } = require('./config/config');

const app = express();

app.engine('hbs', expressHbs.engine({
    layoutsDir: 'views/layouts',
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers : {
        dateFormat: (date, options) => moment(date).format(options),
        comparison: (p1, op, p2) => {
            switch (op) {
                case '===':
                    return p1 === p2;
                case '!==':
                    return p1 !== p2;
                case '<':
                    return p1 < p2;
                case '<=':
                    return p1 <= p2;
                case '>':
                    return p1 > p2;
                case '>=':
                    return p1 >= p2;
                case '&&':
                    return p1 && p2;
                case '||':
                    return p1 || p2;
                default:
                    return false;
            }
        }
    }
}));

app.set('view engine', 'hbs');
app.use('/static', express.static('static'));
app.use('/alien', express.static('alien'));

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.json());
app.use(taskRouter);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${ PORT }, url: ${ URL }`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
