const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  addDependency,
  deleteTask
} = require('../controllers/taskController');

router.get('/project/:projectId', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id/status', protect, updateTaskStatus);
router.post('/dependency', protect, addDependency);
router.delete('/:id', protect, deleteTask);
// Get tasks assigned to current user
router.get('/my-tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .populate('project', 'name')
      .populate('assignee', 'name email');
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;