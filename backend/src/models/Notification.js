const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'task_assigned',
      'task_status_changed',
      'task_mentioned',
      'rca_submitted',
      'rca_reviewed',
      'review_requested',
      'dependency_conflict',
      'dependency_resolved'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  entityType: {
    type: String,
    enum: ['Task', 'RCA', 'Project']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Prevent duplicate notifications (within 5 minutes)
NotificationSchema.index({ 
  userId: 1, 
  type: 1, 
  relatedEntityId: 1,
  createdAt: 1 
});

module.exports = mongoose.model('Notification', NotificationSchema);