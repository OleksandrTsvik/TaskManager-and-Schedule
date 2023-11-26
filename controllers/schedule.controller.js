const scheduleService = require('../services/schedule.service');
const generateError = require('../utils/generate-error.util');

const getSchedule = async (req, res, next) => {
  try {
    const {
      schedule,
      countDay,
      currentWeek,
      currentWeekday,
      displaySchedule,
      errors,
    } = await scheduleService.getSchedule(req, res, next);

    res.render('schedule.hbs', {
      title: 'Schedule',
      schedule,
      countDay,
      currentWeek,
      currentWeekday,
      displaySchedule,
      errors,
    });
  } catch (err) {
    next(generateError(err));
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    await scheduleService.updateSchedule(req, res, next);

    res.status(201).redirect('/settings');
  } catch (err) {
    next(generateError(err));
  }
};

module.exports = {
  getSchedule,
  updateSchedule,
};
