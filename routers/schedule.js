const createError = require("http-errors");
const express = require('express');

const getSchedule = require('../utils/parsing/schedule');
const getOptionalSubjects = require('../utils/parsing/google-excel');

const router = new express.Router();

router.get('/schedule', async (req, res, next) => {
    try {


        res.render('schedule.hbs', {
            title: 'Schedule',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.get('/schedule/update', async (req, res, next) => {
    try {
        let schedule = await getSchedule();
        let optionalSubjects = await getOptionalSubjects();



        res.render('schedule.hbs', {
            title: 'Schedule',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;