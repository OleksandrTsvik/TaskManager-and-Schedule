const TaskModel = require('../models/task.model');
const HeadingModel = require('../models/heading.model');
const { SETTINGS_KEYS } = require('../config/db.conf');
const settingsService = require('./settings.service');
const ApiError = require('../utils/api-error.util');

const getAllNotCompletedTasks = async (req, res, next) => {
  let heads = await HeadingModel.find({}).sort({ text: 1 }).lean();

  let tasks = await TaskModel.find({ completed: false })
    .sort('position')
    .lean();

  let countDaysDisplayLastCompletedTasks =
    await settingsService.getSettingsValueByKey(
      SETTINGS_KEYS.countDaysDisplayLastCompletedTasks,
    );

  let dateLastTasks = new Date();

  dateLastTasks.setDate(
    dateLastTasks.getDate() - countDaysDisplayLastCompletedTasks,
  );

  let tasksCompleted = await TaskModel.find({
    completed: true,
    dateEnd: { $gte: dateLastTasks },
  }).lean();

  tasksCompleted.sort((t1, t2) =>
    (t1.dateEnd || -1) > (t2.dateEnd || -1) ? -1 : 1,
  );

  return {
    tasks,
    tasksCompleted,
    heads,
    countDaysDisplayLastCompletedTasks,
  };
};

const getAllCompletedTasks = async (req, res, next) => {
  let heads = await HeadingModel.find({}).sort({ text: 1 }).lean();

  let tasksCompleted = await TaskModel.find({ completed: true }).lean();
  tasksCompleted.sort((t1, t2) =>
    (t1.dateEnd || -1) > (t2.dateEnd || -1) ? -1 : 1,
  );

  return {
    tasksCompleted,
    heads,
  };
};

const createTask = async (req, res, next) => {
  let task = new TaskModel(req.body);
  await task.save();
};

const updateOneFieldOrDeleteTask = async (req, res, next) => {
  switch (req.query.operation) {
    case 'not-completed':
      await TaskModel.updateOne(
        { _id: req.params.id },
        {
          $set: {
            completed: false,
            dateEnd: null,
            position: -1,
          },
        },
      );
      break;
    case 'completed':
      await TaskModel.updateOne(
        { _id: req.params.id },
        { $set: { completed: true, dateEnd: new Date() } },
      );
      break;
    case 'delete':
      await TaskModel.deleteOne({ _id: req.params.id });
      break;
    case 'change-text-color':
      await TaskModel.updateOne(
        { _id: req.params.id },
        { $set: { color: '#' + req.query.color } },
      );
      return;
    case 'change-background-color':
      await TaskModel.updateOne(
        { _id: req.params.id },
        { $set: { backgroundColor: '#' + req.query['background-color'] } },
      );
      return;
    default:
      throw ApiError.BadRequest('Unknown operator GET for "tasks".');
  }
};

const updateTask = async (req, res, next) => {
  switch (req.query.operation) {
    case 'edit':
      await TaskModel.updateOne({ _id: req.params.id }, { $set: req.body });
      break;
    default:
      throw ApiError.BadRequest('Unknown operator POST for "tasks".');
  }
};

const sortTasks = async (req, res, next) => {
  let arr = req.body;

  for (let i = 0; i < arr.length; i++) {
    await TaskModel.updateOne(
      { _id: arr[i]._id },
      {
        $set: {
          position: arr[i].position,
        },
      },
    );
  }
};

const countNotCompletedTasks = async (req, res, next) => {
  return TaskModel.count({ completed: false });
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
