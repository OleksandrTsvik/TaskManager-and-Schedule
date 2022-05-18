const createError = require("http-errors");

function errorGeneration404(req, res, next) {
    next(createError(404));
}

function errorHandling(error, req, res, next) {
    console.log(error.message);
    let description = 'Error';

    switch (error.status) {
        case 404:
            description = 'Page Not Found';
            break;
        case 500:
            description = 'Internal Server Error';
            break;
    }

    res.render('error.hbs', {
        title: `Error ${error.status}`,
        status: error.status,
        description
    });
}

module.exports = { errorGeneration404, errorHandling };