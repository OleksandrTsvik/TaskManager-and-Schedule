const moment = require("moment");

function dateFormat(date, options) {
    return moment(date).format(options);
}

function comparison(p1, op, p2) {
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

function isNotCompletedTasks(arrTasks) {
    try {
        return !arrTasks[0].completed;
    } catch (err) {
        return false;
    }
}

function getYear() {
    return (new Date()).getFullYear();
}

module.exports = { dateFormat, comparison, isNotCompletedTasks, getYear };