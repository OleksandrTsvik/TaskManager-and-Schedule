const createError = require("http-errors");
const express = require('express');

const models = require('../models/index');

const router = new express.Router();

router.get('/tasks/heading', async (req, res, next) => {
    try {
        let heads = await models.Heading
            .find({})
            .sort({text: 1})
            .lean();

        res.render('heading.hbs', {
            title: 'Headlines',
            heads
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.post('/tasks/heading', async (req, res, next) => {
    try {
        if (req.query.edit) {
            await models.Heading.updateOne({_id: req.query.edit}, {$set: req.body});
        } else {
            let head = new models.Heading(req.body);
            await head.save();
        }

        res.redirect('/tasks/heading');
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.get('/tasks/heading/delete/:id', async (req, res, next) => {
    try {
        await models.Heading.deleteOne({_id: req.params.id});

        res.redirect('/tasks/heading');
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;