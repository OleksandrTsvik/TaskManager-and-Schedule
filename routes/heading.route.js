const express = require('express');

const {
  getAllHeadings,
  createOrUpdateHeading,
  deleteHeading,
} = require('../controllers/heading.controller');

const router = new express.Router();

router.get('/', getAllHeadings);
router.post('/', createOrUpdateHeading);
router.get('/delete/:id', deleteHeading);

module.exports = router;
