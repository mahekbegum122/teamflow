const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// Get all tasks for a project
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate('assignee', 'name email')
      .populate('dependsOn', 'title status');
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignee, priority, dueDate } = req.body;
    
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee,
      priority: priority || 'medium',
      dueDate
    });
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ⭐ Update task status - DEPENDENCY CHECK
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(id).populate('dependsOn', 'title status');
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    // 🔥 DEPENDENCY CHECK - This is what they want to see!
    if (status === 'in_progress' || status === 'done') {
      const incompleteDeps = task.dependsOn.filter(d => d.status !== 'done');
      if (incompleteDeps.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot start/complete task. These dependencies are not complete: ${incompleteDeps.map(d => d.title).join(', ')}`,
          type: 'dependency_conflict',
          dependencies: incompleteDeps
        });
      }
    }
    
    task.status = status;
    await task.save();
    
    // If task is done, check if any dependent tasks can now proceed
    if (status === 'done') {
      await checkDependentTasks(task);
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add dependency between tasks
const addDependency = async (req, res) => {
  try {
    const { taskId, dependsOnId } = req.body;
    
    const task = await Task.findById(taskId);
    const dependency = await Task.findById(dependsOnId);
    
    if (!task || !dependency) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    // Check for circular dependency
    const hasCircular = await checkCircularDependency(dependsOnId, taskId);
    if (hasCircular) {
      return res.status(400).json({
        success: false,
        message: 'This would create a circular dependency'
      });
    }
    
    if (!task.dependsOn.includes(dependsOnId)) {
      task.dependsOn.push(dependsOnId);
      await task.save();
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Check circular dependencies
const checkCircularDependency = async (startTaskId, endTaskId, visited = new Set()) => {
  if (visited.has(startTaskId)) return false;
  visited.add(startTaskId);
  
  if (startTaskId.toString() === endTaskId.toString()) return true;
  
  const task = await Task.findById(startTaskId).populate('dependsOn');
  for (const dep of task.dependsOn) {
    if (await checkCircularDependency(dep._id, endTaskId, visited)) {
      return true;
    }
  }
  return false;
};

// Helper: Check dependent tasks that can now proceed
const checkDependentTasks = async (task) => {
  const dependentTasks = await Task.find({
    dependsOn: task._id,
    status: { $nin: ['done', 'in_progress'] }
  }).populate('assignee', 'name email');
  
  for (const depTask of dependentTasks) {
    const allDeps = await Task.find({
      _id: { $in: depTask.dependsOn },
      status: { $ne: 'done' }
    });
    
    if (allDeps.length === 0 && depTask.assignee) {
      await Notification.create({
        userId: depTask.assignee._id,
        type: 'task_status_changed',
        message: `Task "${depTask.title}" is now unblocked - all dependencies are complete`,
        relatedEntityId: depTask._id,
        entityType: 'Task'
      });
    }
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  addDependency,
  deleteTask
};