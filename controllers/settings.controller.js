const settingsService = require('../services/settings.service');
const generateError = require('../utils/generate-error.util');

const getSettings = async (req, res, next) => {
  try {
    const { inputNames, selectiveSubjects } = await settingsService.getSettings(
      req,
      res,
      next,
    );

    res.render('settings.hbs', {
      title: 'Settings',
      inputNames,
      selectiveSubjects,
    });
  } catch (err) {
    next(generateError(err));
  }
};

const createOrUpdateSettings = async (req, res, next) => {
  try {
    await settingsService.createOrUpdateSettings(req, res, next);

    res.redirect('/settings');
  } catch (err) {
    next(generateError(err));
  }
};

const toggleShowScheduleByGroup = async (req, res, next) => {
  try {
    await settingsService.toggleShowScheduleByGroup(req, res, next);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    next(generateError(err));
  }
};

const toggleShowScheduleBySubjectName = async (req, res, next) => {
  try {
    await settingsService.toggleShowScheduleBySubjectName(req, res, next);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    next(generateError(err));
  }
};

const toggleShowScheduleBySubjectId = async (req, res, next) => {
  try {
    await settingsService.toggleShowScheduleBySubjectId(req, res, next);

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    next(generateError(err));
  }
};

module.exports = {
  getSettings,
  createOrUpdateSettings,
  toggleShowScheduleByGroup,
  toggleShowScheduleBySubjectName,
  toggleShowScheduleBySubjectId,
};
