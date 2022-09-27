const createError = require("http-errors");
const express = require('express');

const { SETTINGS_KEYS, ENCRYPTION_FIELDS } = require('../config/config');
const models = require('../models/index');
const crypt = require('../utils/encryption');
const { getValueByKey } = require("../utils/settings");

const router = new express.Router();

router.get('/settings', async (req, res, next) => {
    try {
        const inputNames = {};

        for (let param of Object.values(SETTINGS_KEYS)) {
            let settingsValue = await getValueByKey(param);

            if (settingsValue) {
                inputNames[param] = settingsValue;
            } else {
                inputNames[param] = '';
            }
        }

        let selectiveSubjects = await models.Schedule.find({selective: true}).lean();

        res.render('settings.hbs', {
            title: 'Settings',
            inputNames,
            selectiveSubjects
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.post('/settings', async (req, res, next) => {
    try {
        const arrExpectedParams = Object.keys(SETTINGS_KEYS);

         for (let param of arrExpectedParams) {
            if (req.body.hasOwnProperty(param)) {
                let bodyValue = req.body[param];

                if (ENCRYPTION_FIELDS.includes(param)) {
                    bodyValue = crypt.encryption(bodyValue);
                }

                await models.Settings.findOneAndUpdate(
                    {
                        key: param
                    },
                    {
                        key: param,
                        value: bodyValue
                    },
                    {
                        upsert: true
                    }
                );
            }
        }

        res.redirect('/settings');
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.put('/settings/group', async (req, res, next) => {
    try {
        let { group } = req.query;
        let selected = req.query.selected === 'true';

        if (!group) {
            return res.status(404).json({
                message: 'Bad request',
            });
        }

        let arrGroups = await getValueByKey(SETTINGS_KEYS.arrayGroups);
        let arrSubjects = await getValueByKey(SETTINGS_KEYS.arraySubjects);

        arrGroups.forEach((item) => {
            if (item.group === group) {
                item.selected = selected;
            }
        });

        await models.Settings.updateOne({key: SETTINGS_KEYS.arrayGroups}, {value: arrGroups});
        await models.Schedule.updateMany({
                subject: { "$in": arrSubjects.filter(item => item.selected).map(item => item.subject) },
                groups: { "$in": arrGroups.filter(item => item.selected).map(item => item.group) },
                selective: false
            },
            {show: true}
        );
        await models.Schedule.updateMany({
                subject: { "$in": arrSubjects.filter(item => item.selected).map(item => item.subject) },
                $and: [
                    { groups: {"$ne": []} },
                    { groups: {"$nin": arrGroups.filter(item => item.selected).map(item => item.group)} }
                ],
                selective: false
            },
            {show: false}
        );

        res.status(200).json({
            message: 'OK',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.put('/settings/subject', async (req, res, next) => {
    try {
        let { subject } = req.query;
        let selected = req.query.selected === 'true';

        if (!subject) {
            return res.status(404).json({
                message: 'Bad request',
            });
        }

        let arrSubjects = await getValueByKey(SETTINGS_KEYS.arraySubjects);
        let arrGroups = await getValueByKey(SETTINGS_KEYS.arrayGroups);

        arrSubjects.forEach((item) => {
            if (item.subject === subject) {
                item.selected = selected;
            }
        });

        await models.Settings.updateOne({key: SETTINGS_KEYS.arraySubjects}, {value: arrSubjects});
        await models.Schedule.updateMany({
                subject,
                $or: [
                    { groups: {"$eq": []} },
                    { groups: {"$in": arrGroups.filter(item => item.selected).map(item => item.group)} }
                ],
                selective: false
            },
            {show: selected}
        );

        res.status(200).json({
            message: 'OK',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.put('/settings/subject/:id', async (req, res, next) => {
    try {
        let { id } = req.params;
        let show = req.query.show === 'true';

        if (!id) {
            return res.status(404).json({
                message: 'Bad request',
            });
        }

        await models.Schedule.updateOne({_id: id}, {show: show});

        res.status(200).json({
            message: 'OK',
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;