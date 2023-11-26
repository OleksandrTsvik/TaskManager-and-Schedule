const headingService = require('../services/heading.service');
const generateError = require('../utils/generate-error.util');

const getAllHeadings = async (req, res, next) => {
  try {
    let heads = await headingService.getAllHeadings(req, res, next);

    res.render('heading.hbs', {
      title: 'Headlines',
      heads,
    });
  } catch (err) {
    next(generateError(err));
  }
};

const createOrUpdateHeading = async (req, res, next) => {
  try {
    await headingService.createOrUpdateHeading(req, res, next);

    res.redirect('/heading');
  } catch (err) {
    next(generateError(err));
  }
};

const deleteHeading = async (req, res, next) => {
  try {
    await headingService.deleteHeading(req, res, next);

    res.redirect('/heading');
  } catch (err) {
    next(generateError(err));
  }
};

module.exports = {
  getAllHeadings,
  createOrUpdateHeading,
  deleteHeading,
};
