const HeadingModel = require('../models/heading.model');

const getAllHeadings = async (req, res, next) => {
  return await HeadingModel.find({}).sort({ text: 1 }).lean();
};

const createOrUpdateHeading = async (req, res, next) => {
  if (req.query.edit) {
    await HeadingModel.updateOne({ _id: req.query.edit }, { $set: req.body });
  } else {
    let head = new HeadingModel(req.body);
    await head.save();
  }
};

const deleteHeading = async (req, res, next) => {
  await HeadingModel.deleteOne({ _id: req.params.id });
};

module.exports = {
  getAllHeadings,
  createOrUpdateHeading,
  deleteHeading,
};
