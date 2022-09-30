const createError = require('http-errors')
const express = require('express');

const models = require('../models/index');
const {getSettingsValueByKey} = require("../utils/settings");
const {SETTINGS_KEYS} = require("../config/config");

const router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        let heads = await models.Heading
            .find({})
            .sort({text: 1})
            .lean();

        let tasks = await models.Task.find({ completed: false }).sort('position').lean();

        let countDaysDisplayLastCompletedTasks = await getSettingsValueByKey(SETTINGS_KEYS.countDaysDisplayLastCompletedTasks);
        let dateLastTasks = new Date();

        dateLastTasks.setDate(dateLastTasks.getDate() - countDaysDisplayLastCompletedTasks);

        let tasksCompleted = await models.Task.find({
            completed: true,
            dateEnd: { $gte: dateLastTasks }
        }).lean();

        tasksCompleted.sort((t1, t2) => (t1.dateEnd || -1) > (t2.dateEnd || -1) ? -1 : 1);

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
        let heads = await models.Heading
            .find({})
            .sort({text: 1})
            .lean();

        let tasksCompleted =  await models.Task.find({completed: true}).lean();
        tasksCompleted.sort((t1, t2) => (t1.dateEnd || -1) > (t2.dateEnd || -1) ? -1 : 1);

        res.render('completed.hbs', {
            title: 'Completed Tasks',
            tasksCompleted,
            heads
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.post('/', async (req, res, next) => {
    try {
        let task = new models.Task(req.body);
        await task.save();

        res.status(201).redirect('/');
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/task/:id', async (req, res, next) => {
    switch (req.query.operation) {
        case 'not-completed':
            await models.Task.updateOne({_id: req.params.id}, {
                $set: {
                    completed: false,
                    dateEnd: null,
                    position: -1
                }
            });
            break;
        case 'completed':
            await models.Task.updateOne({_id: req.params.id}, {$set: { completed: true, dateEnd: new Date() }});
            break;
        case 'delete':
            await models.Task.deleteOne({_id: req.params.id});
            break;
        case 'change-text-color':
            await models.Task.updateOne({_id: req.params.id}, {$set: {color: '#' + req.query.color}});
            return;
        case 'change-background-color':
            await models.Task.updateOne({_id: req.params.id}, {$set: {backgroundColor: '#' + req.query['background-color']}});
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
            await models.Task.updateOne({_id: req.params.id}, {$set: req.body});
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
            await models.Task.updateOne({_id: arr[i]._id}, {
                $set: {
                    position: arr[i].position
                }
            });
        }
    } catch (err) {
        next(createError(500, err.message));
    }
});

router.get('/tasks/count', async (req, res, next) => {
    try {
        res.status(200).json({
            count: await models.Task.count({completed: false})
        });
    } catch(err) {
        next(createError(500, err.message));
    }
});

module.exports = router;
