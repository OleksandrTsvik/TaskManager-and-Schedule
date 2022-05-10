const express = require('express');

const Heading = require('../models/heading');
const Task = require('../models/task');

const router = new express.Router();

router.get('/tasks/heading', async (req, res) => {
    try {
        let heads = await Heading.find({}).lean();
        let tasks = await Task.find({completed: false}).lean();

        res.render('heading.hbs', {
            title: 'Headlines',
            heads,
            tasks
        });
    } catch(err) {
        res.status(400).send(err.message);
    }
});

router.post('/tasks/heading', async (req, res) => {
    try {
        if (req.query.edit) {
            await Heading.updateOne({_id: req.query.edit}, {$set: req.body});
        } else {
            let head = new Heading(req.body);
            await head.save();
        }

        res.redirect('/tasks/heading');
    } catch(err) {
        res.status(400).send(err.message);
    }
});

router.get('/tasks/heading/delete/:id', async (req, res) => {
    try {
        await Heading.deleteOne({_id: req.params.id});

        res.redirect('/tasks/heading');
    } catch(err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;