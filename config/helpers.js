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

function operation(p1, op, p2) {
    switch (op) {
        case '/':
            return p2 != 0 ? p1 / p2 : NaN;
        case '*':
            return p1 * p2;
        case '+':
            return p1 + p2;
        case '-':
            return p1 - p2;
        default:
            return NaN;
    }
}

function getYear() {
    return (new Date()).getFullYear();
}

function breaklines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, '<br>');
}

function displayArray(arr, separator = ', ') {
    return arr.join(separator);
}

function numberToEnglishDay(numberDay) {
    switch (numberDay) {
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        case 7: return 'Sunday';
        default: return 'Unknown day';
    }
}

function increment(number) {
    return parseInt(number) + 1;
}

function forLoop(from, to, increment, block) {
    let temp = '';

    for(let i = from; i <= to; i += increment) {
        temp += block.fn(i);
    }

    return temp;
}

module.exports = {
    dateFormat,
    comparison,
    getYear,
    breaklines,
    increment,
    displayArray,
    numberToEnglishDay,
    forLoop,
    operation,
};