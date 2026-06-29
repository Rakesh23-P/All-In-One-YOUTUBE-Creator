const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate, taskRules } = require('../middleware/validation');

router.use(protect); // Secure all task endpoints

router.route('/')
  .get(getTasks)
  .post(taskRules(), validate, createTask);

router.route('/:id')
  .put(taskRules(), validate, updateTask)
  .delete(deleteTask);

module.exports = router;
