const createError = require("http-errors");
const express = require('express');

const { SETTINGS_KEYS, MS_PER_DAY } = require('../config/config');
const models = require('../models/index');
const getSchedule = require('../utils/parsing/schedule');
const getOptionalSubjects = require('../utils/parsing/google-excel');
const getCabinetSchedule = require('../utils/parsing/cabinet-schedule');
const { getSettingsValueByKey } = require('../utils/settings');

const router = new express.Router();

router.get('/schedule', async (req, res, next) => {
    try {
        let schedule = await models.Schedule.find({}).lean();
        let displaySchedule = schedule.filter(item => item.show);

        let times = [
            '8:30-9:50',
            '10:00-11:20',
            '11:40-13:00',
            '13:30-14:50',
            '15:00-16:20',
            '16:30-17:50',
            '18:00-19:20'
        ];

        let sortDisplaySchedule = [];

        let countWeek = displaySchedule.reduce((schedule, current) => schedule.week > current.week ? schedule : current).week;
        let countDay = displaySchedule.reduce((schedule, current) => schedule.weekday > current.weekday ? schedule : current).weekday;

        let nowDate = new Date();
        let firstWeekScheduleDate = new Date(await getSettingsValueByKey(SETTINGS_KEYS.dateFirstWeekSchedule));
        let numberWeek = Math.trunc(Math.ceil(Math.abs(nowDate - firstWeekScheduleDate) / MS_PER_DAY) / 7);

        let currentWeekday = nowDate.getDay();
        if (currentWeekday === 0) {
            currentWeekday = 7;
        }

        let currentWeek = numberWeek % countWeek;
        if (currentWeek === 0) {
            currentWeek = countWeek;
        }

        let cabinetData = await getCabinetSchedule();

        if (currentWeekday > countDay) {
            cabinetData = false;

            currentWeekday = 1;
            currentWeek++;
        }

        for (let i = 1; i <= countWeek; i++) {
            let week = [];

            for (let time of times) {
                let timeRow = [];

                for (let j = 1; j <= countDay; j++) {
                    let subject = displaySchedule.find(item =>
                        item.week === i &&
                        item.time === time &&
                        item.weekday === j
                    );

                    if (!subject) {
                        subject = {week: i, weekday: j, time};
                    }

                    if (subject.week === currentWeek && subject.weekday === currentWeekday) {
                        subject.today = true;

                        if (cabinetData) {
                            let cabinetSubject = cabinetData.find(item => (
                                item.time === subject.time &&
                                item.subject === subject.subject
                            ));

                            if (cabinetSubject) {
                                subject.cabinetContent = cabinetSubject.content;
                            } else {
                                subject.cabinetContent = 'There are no data!!!';
                            }
                        }
                    }

                    timeRow.push(subject);
                }

                week.push(timeRow);
            }

            sortDisplaySchedule.push(week);
        }

        res.render('schedule.hbs', {
            title: 'Schedule',
            schedule,
            countDay,
            currentWeek, currentWeekday,
            displaySchedule: sortDisplaySchedule
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.get('/schedule/update', async (req, res, next) => {
    try {
        let schedule = await getSchedule();
        let optionalSubjects = await getOptionalSubjects();

        let lastArrSubjects = await getSettingsValueByKey(SETTINGS_KEYS.arraySubjects);
        let lastArrGroups = await getSettingsValueByKey(SETTINGS_KEYS.arrayGroups);
        let lastOptionalSubjects = await models.Schedule.find({selective: true});

        for (let subject of schedule) {
            if (
                (
                    subject.groups.length === 0 ||
                    lastArrGroups.some(item => item.selected && subject.groups.includes(item.group))
                ) &&
                lastArrSubjects.some(item => item.selected && item.subject === subject.subject)
            ) {
                subject.show = true;
            }
        }

        for (let subject of optionalSubjects) {
            if (
                lastOptionalSubjects.some(item => (
                    item.show &&
                    item.week === subject.week &&
                    item.weekday === subject.weekday &&
                    item.time === subject.time &&
                    item.subject === subject.subject &&
                    item.teacher.filter(teacher => !subject.teacher.includes(teacher)).length === 0 &&
                    item.classRoom === subject.classRoom &&
                    item.groups.filter(group => !subject.groups.includes(group)).length === 0
                ))
            ) {
                subject.show = true;
            }
        }

        let subjects = [...schedule, ...optionalSubjects];
        let arrGroups = [], arrSubjects = [];

        for (let subject of schedule) {
            for (let group of subject.groups) {
                if (!arrGroups.some(item => item.group === group)) {
                    arrGroups.push({
                        group,
                        selected: lastArrGroups.some(item => item.selected && item.group === group)
                    });
                }
            }
            
            if (!arrSubjects.some(item => item.subject === subject.subject)) {
                arrSubjects.push({
                    subject: subject.subject,
                    selected: lastArrSubjects.some(item => item.selected && item.subject === subject.subject)
                });
            }
        }

        await models.Schedule.deleteMany({});
        await models.Schedule.insertMany(subjects);

        await models.Settings.findOneAndUpdate(
            {
                key: SETTINGS_KEYS.arraySubjects
            },
            {
                key: SETTINGS_KEYS.arraySubjects,
                value: arrSubjects
            },
            {
                upsert: true
            }
        );

        await models.Settings.findOneAndUpdate(
            {
                key: SETTINGS_KEYS.arrayGroups
            },
            {
                key: SETTINGS_KEYS.arrayGroups,
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