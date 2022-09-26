const moment = require("moment");

function dateFormat(date, options) {
    return moment(date).format(options);
}

function comparison(p1, op, p2) {
    switch (op) {
        case '==':
            return p1 == p2;
        case '!=':
            return p1 != p2;
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

function getYear() {
    return (new Date()).getFullYear();
}

function breaklines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, '<br>');
}

function increment(number) {
    return parseInt(number) + 1;
}

module.exports = {
    dateFormat, comparison,
    getYear, breaklines,
    increment
};