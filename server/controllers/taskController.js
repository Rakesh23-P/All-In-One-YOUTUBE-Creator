const Task = require('../models/Task');

// @desc    Get all creator tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ creatorId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: new Date(dueDate),
      creatorId: req.user.id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task (e.g., status, description, priority)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, creatorId: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);

    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creatorId: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
