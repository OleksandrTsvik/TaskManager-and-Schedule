const createError = require("http-errors");
const express = require('express');

const { settingsKeys } = require('../config/config');
const models = require('../models/index');
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

        let subjects = [...schedule, ...optionalSubjects];

        await models.Schedule.deleteMany({});
        await models.Schedule.insertMany(subjects);

        let arrGroups = [], arrSubjects = [];

        for (let subject of schedule) {
            for (let group of subject.groups) {
                if (!arrGroups.find(item => item.group === group)) {
                    arrGroups.push({
                        group,
                        selected: false
                    });
                }
            }
            
            if (!arrSubjects.find(item => item.subject === subject.subject)) {
                arrSubjects.push({
                    subject: subject.subject,
                    selected: false
                });
            }
        }

        await models.Settings.findOneAndUpdate(
            {
                key: settingsKeys.arraySubjects
            },
            {
                key: settingsKeys.arraySubjects,
                value: arrSubjects
            },
            {
                upsert: true
            }
        );

        await models.Settings.findOneAndUpdate(
            {
                key: settingsKeys.arrayGroups
            },
            {
                key: settingsKeys.arrayGroups,
                value: arrGroups
            },
            {
                upsert: true
            }
        );

        res.status(201).redirect('/settings');
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;