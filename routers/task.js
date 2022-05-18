const createError = require('http-errors')
const express = require('express');

const Task = require('../models/task');
const Heading = require('../models/heading');

const router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        let heads = await Heading.find({}).lean();

        let tasks = await Task.find({ completed: false }).sort('position').lean();
        let tasksCompleted = await Task.find({ completed: true }).lean();

        res.render('index.hbs', {
            title: 'Task Manager',
            tasks,
            tasksCompleted,
            heads
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/completed', async (req, res, next) => {
    try {
        let heads = await Heading.find({}).lean();

        let tasks = await Task.find({}).lean();
        let tasksCompleted = tasks.filter(task => task.completed);

        tasks = tasks.filter(task => !task.completed);

        res.render('completed.hbs', {
            title: 'Completed Tasks',
            tasks,
            tasksCompleted,
            heads
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/not-completed', async (req, res, next) => {
    try {
        let heads = await Heading.find({}).lean();

        let tasks = await Task.find({ completed: false }).sort('position').lean();

        res.render('not-completed.hbs', {
            title: 'Not Completed Tasks',
            tasks,
            heads
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.post('/', async (req, res, next) => {
    try {
        let task = new Task(req.body);
        await task.save();
        res.status(201).redirect('/');
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/task/:id', async (req, res, next) => {
    switch (req.query.operation) {
        case 'not-completed':
            await Task.updateOne({_id: req.params.id}, {
                $set: {
                    completed: false,
                    position: -1
                }
            });
            break;
        case 'completed':
            await Task.updateOne({_id: req.params.id}, {$set: { completed: true }});
            break;
        case 'delete':
            await Task.deleteOne({_id: req.params.id});
            break;
        case 'change-text-color':
            await Task.updateOne({_id: req.params.id}, {$set: {color: '#' + req.query.color}});
            return;
        case 'change-background-color':
            await Task.updateOne({_id: req.params.id}, {$set: {backgroundColor: '#' + req.query['background-color']}});
            return;
        default:
            next(createError(400, 'Unknown operator GET for "task".'));
            break;
    }

    res.redirect('/');
});

router.post('/task/:id', async (req, res, next) => {
    switch (req.query.operation) {
        case 'edit':
            await Task.updateOne({_id: req.params.id}, {$set: req.body});
            break;
        default:
            next(createError(400, 'Unknown operator POST for "task".'));
            break;
    }

    res.redirect('/');
});

router.post('/tasks/sort', async (req, res, next) => {
    try {
        let arr = req.body;

        for (let i = 0; i < arr.length; i++) {
            await Task.updateOne({_id: arr[i]._id}, {
                $set: {
                    position: arr[i].position
                }
            });
        }
    } catch (err) {
        next(createError(500, err.message));
    }
});

module.exports = router;
