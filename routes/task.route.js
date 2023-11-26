const express = require('express');

const {
  getAllNotCompletedTasks,
  getAllCompletedTasks,
  createTask,
  updateOneFieldOrDeleteTask,
  updateTask,
  sortTasks,
  countNotCompletedTasks,
} = require('../controllers/task.controller');

const router = new express.Router();

router.get('/', getAllNotCompletedTasks);
router.post('/', createTask);
router.get('/tasks/completed', getAllCompletedTasks);
router.get('/tasks/count', countNotCompletedTasks);
router.get('/tasks/:id', updateOneFieldOrDeleteTask);
router.post('/tasks/sort', sortTasks);
router.post('/tasks/:id', updateTask);

module.exports = router;
