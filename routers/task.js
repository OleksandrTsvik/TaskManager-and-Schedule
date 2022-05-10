const express = require('express');

const Task = require('../models/task');

const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        let tasks = await Task.find({ completed: false }).lean();
        let completedTasks = await Task.find({ completed: true }).lean();

        res.render('index.hbs', {
            title: 'Task Manager',
            tasks: tasks,
            completedTasks: completedTasks
        });
    } catch (err) {
        res.status(400).send();
    }
});

router.get('/completed', async (req, res) => {
    try {
        let tasks = await Task.find({ completed: true }).lean();

        res.render('completed.hbs', {
            title: 'Completed Tasks',
            tasks: tasks
        });
    } catch (err) {
        res.status(400).send();
    }
});

router.get('/not-completed', async (req, res) => {
    try {
        let tasks = await Task.find({ completed: false }).lean();

        res.render('not-completed.hbs', {
            title: 'Not Completed Tasks',
            tasks: tasks
        });
    } catch (err) {
        res.status(400).send();
    }
});

router.post('/', async (req, res) => {
    try {
        let task = new Task(req.body);
        await task.save();
        res.status(201).redirect('/');
    } catch (err) {
        res.status(500).send();
    }
});

router.get('/task/:id', async (req, res) => {
    switch (req.query.operation) {
        case 'not-completed':
            await Task.updateOne({_id: req.params.id}, {$set: {completed: false}});
            break;
        case 'completed':
            await Task.updateOne({_id: req.params.id}, {$set: {completed: true}});
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
            res.status(400).send();
            break;
    }

    res.redirect('/');
});

router.post('/task/:id', async (req, res) => {
    console.log(req.body)
    switch (req.query.operation) {
        case 'edit':
            await Task.updateOne({_id: req.params.id}, {$set: req.body});
            break;
        default:
            res.status(400).send();
            break;
    }

    res.redirect('/');
});

module.exports = router;
