const createError = require("http-errors");
const express = require('express');

const Heading = require('../models/heading');
const Task = require('../models/task');

const router = new express.Router();

router.get('/tasks/heading', async (req, res, next) => {
    try {
        let heads = await Heading.find({}).lean();
        let tasks = await Task.find({completed: false}).lean();

        res.render('heading.hbs', {
            title: 'Headlines',
            heads,
            tasks
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.post('/tasks/heading', async (req, res, next) => {
    try {
        if (req.query.edit) {
            await Heading.updateOne({_id: req.query.edit}, {$set: req.body});
        } else {
            let head = new Heading(req.body);
            await head.save();
        }

        res.redirect('/tasks/heading');
    } catch(err) {
        next(createError(500, err.message));
    }
});

router.get('/tasks/heading/delete/:id', async (req, res, next) => {
    try {
        await Heading.deleteOne({_id: req.params.id});

        res.redirect('/tasks/heading');
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;