const express = require('express');

const {
  getSchedule,
  updateSchedule,
} = require('../controllers/schedule.controller');

const router = new express.Router();

router.get('/', getSchedule);
router.get('/update', updateSchedule);

module.exports = router;
