import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'ACCESS']
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  resourceType: {
    type: String,
    enum: ['note', 'user', 'system'],
    default: 'note'
  },
  resourceId: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for commonly filtered fields
logSchema.index({ user: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ username: 1, timestamp: -1 });

export const Log = mongoose.model('Log', logSchema);
