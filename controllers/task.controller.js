const taskService = require('../services/task.service');
const generateError = require('../utils/generate-error.util');

const getAllNotCompletedTasks = async (req, res, next) => {
  try {
    const { tasks, tasksCompleted, heads, countDaysDisplayLastCompletedTasks } =
      await taskService.getAllNotCompletedTasks(req, res, next);

    res.render('index.hbs', {
      title: 'Task Manager',
      tasks,
      tasksCompleted,
      heads,
      countDaysDisplayLastCompletedTasks,
    });
  } catch (err) {
    next(generateError(err));
  }
};

const getAllCompletedTasks = async (req, res, next) => {
  try {
    const { tasksCompleted, heads } = await taskService.getAllCompletedTasks(
      req,
      res,
      next,
    );

    res.render('completed.hbs', {
      title: 'Completed Tasks',
      tasksCompleted,
      heads,
    });
  } catch (err) {
    next(generateError(err));
  }
};

const createTask = async (req, res, next) => {
  try {
    await taskService.createTask(req, res, next);

    res.status(201).redirect('/');
  } catch (err) {
    next(generateError(err));
  }
};

const updateOneFieldOrDeleteTask = async (req, res, next) => {
  try {
    await taskService.updateOneFieldOrDeleteTask(req, res, next);

    res.redirect('/');
  } catch (err) {
    next(generateError(err));
  }
};

const updateTask = async (req, res, next) => {
  try {
    await taskService.updateTask(req, res, next);

    res.redirect('/');
  } catch (err) {
    next(generateError(err));
  }
};

const sortTasks = async (req, res, next) => {
  try {
    await taskService.sortTasks(req, res, next);
  } catch (err) {
    next(generateError(err));
  }
};

const countNotCompletedTasks = async (req, res, next) => {
  try {
    const count = await taskService.countNotCompletedTasks(req, res, next);

    res.status(200).json({ count });
  } catch (err) {
    next(generateError(err));
  }
};

module.exports = {
  getAllNotCompletedTasks,
  getAllCompletedTasks,
  createTask,
  updateOneFieldOrDeleteTask,
  updateTask,
  sortTasks,
  countNotCompletedTasks,
};
