const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  getProject
} = require('../controllers/projectController');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.get('/:id', protect, getProject);

module.exports = router;