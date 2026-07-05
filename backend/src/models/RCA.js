const mongoose = require('mongoose');

const RCASchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an RCA title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  status: {
    type: String,
    enum: ['reported', 'investigating', 'in_review', 'approved', 'rejected', 'closed'],
    default: 'reported'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  affectedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  sections: {
    timeline: { type: String, default: '' },
    contributingFactors: { type: String, default: '' },
    correctiveActions: { type: String, default: '' },
    preventiveMeasures: { type: String, default: '' }
  },
  // 👇 REVIEW WORKFLOW
  reviews: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    decision: {
      type: String,
      enum: ['approved', 'rejected'],
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('RCA', RCASchema);