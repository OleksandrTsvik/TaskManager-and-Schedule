const mongosse = require('mongoose');

const ScheduleModel = mongosse.model('Schedule', {
  week: {
    type: Number,
    required: true,
  },
  weekday: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: Array,
  },
  classRoom: {
    type: String,
  },
  groups: {
    type: Array,
  },
  show: {
    type: Boolean,
    default: false,
  },
  selective: {
    type: Boolean,
    default: false,
  },
});

module.exports = ScheduleModel;
