const createError = require("http-errors");
const express = require('express');

const { settingsKeys, encryptionFields } = require('../config/config');
const models = require('../models/index');

const crypt = require('../utils/encryption');

const router = new express.Router();

router.get('/settings', async (req, res, next) => {
    try {
        const inputNames = {};

        for (let param of Object.keys(settingsKeys)) {
            let settings = await models.Settings.findOne({ key: param });

            if (settings) {
                if (encryptionFields.includes(param)) {
                    inputNames[param] = crypt.decryption(settings.value);
                } else {
                    inputNames[param] = settings.value;
                }
            } else {
                inputNames[param] = '';
            }
        }

        res.render('settings.hbs', {
            title: 'Settings',
            inputNames
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.post('/settings', async (req, res, next) => {
    try {
        const arrExpectedParams = Object.keys(settingsKeys);

         for (let param of arrExpectedParams) {
            if (req.body.hasOwnProperty(param)) {
                let bodyValue = req.body[param];
                console.log(bodyValue)
                if (encryptionFields.includes(param)) {
                    bodyValue = crypt.encryption(bodyValue);
                    console.log('crypt', bodyValue)
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

module.exports = router;