const express = require('express');

const {
  getSettings,
  createOrUpdateSettings,
  toggleShowScheduleByGroup,
  toggleShowScheduleBySubjectName,
  toggleShowScheduleBySubjectId,
} = require('../controllers/settings.controller');

const router = new express.Router();

router.get('/', getSettings);
router.post('/', createOrUpdateSettings);
router.put('/group', toggleShowScheduleByGroup);
router.put('/subject', toggleShowScheduleBySubjectName);
router.put('/subject/:id', toggleShowScheduleBySubjectId);

module.exports = router;
