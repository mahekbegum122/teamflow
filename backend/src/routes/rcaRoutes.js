const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const RCA = require('../models/RCA');
const Notification = require('../models/Notification');

// Get all RCAs for a project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const rcas = await RCA.find({ project: req.params.projectId })
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('reviews.reviewer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: rcas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new RCA
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, severity, projectId } = req.body;
    
    const rca = await RCA.create({
      title,
      description,
      severity: severity || 'medium',
      project: projectId,
      reportedBy: req.user._id,
      status: 'reported'
    });
    
    // Create notification for project members
    await Notification.create({
      userId: req.user._id,
      type: 'rca_submitted',
      message: `New RCA reported: "${title}"`,
      relatedEntityId: rca._id,
      entityType: 'RCA'
    });
    
    res.status(201).json({ success: true, data: rca });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update RCA status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const rca = await RCA.findById(req.params.id);
    
    if (!rca) {
      return res.status(404).json({ success: false, message: 'RCA not found' });
    }
    
    rca.status = status;
    if (status === 'closed') {
      rca.resolvedAt = new Date();
    }
    await rca.save();
    
    res.json({ success: true, data: rca });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add review to RCA
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { decision, comment } = req.body;
    const rca = await RCA.findById(req.params.id);
    
    if (!rca) {
      return res.status(404).json({ success: false, message: 'RCA not found' });
    }
    
    // Check if user already reviewed
    const existingReview = rca.reviews.find(
      r => r.reviewer.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this RCA' });
    }
    
    rca.reviews.push({
      reviewer: req.user._id,
      decision,
      comment
    });
    
    // Update status based on reviews
    if (decision === 'rejected') {
      rca.status = 'rejected';
    } else if (rca.reviews.length >= 2) {
      const allApproved = rca.reviews.every(r => r.decision === 'approved');
      if (allApproved) {
        rca.status = 'approved';
      }
    }
    
    await rca.save();
    
    // Notify reporter
    await Notification.create({
      userId: rca.reportedBy,
      type: 'rca_reviewed',
      message: `RCA "${rca.title}" received a review: ${decision}`,
      relatedEntityId: rca._id,
      entityType: 'RCA'
    });
    
    res.json({ success: true, data: rca });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;