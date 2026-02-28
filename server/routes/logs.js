import express from 'express';
import { Log } from '../models/index.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { logActivity, asyncHandler } from '../middleware/logger.js';

const router = express.Router();

// Get all logs (admin only)
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { action, user, days = 7 } = req.query;

  let query = {};

  // Filter by action
  if (action) {
    query.action = action;
  }

  // Filter by user
  if (user) {
    query.username = user;
  }

  // Filter by date (last N days)
  if (days) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    query.timestamp = { $gte: date };
  }

  const logs = await Log.find(query)
    .sort({ timestamp: -1 })
    .limit(1000);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
}));

// Get logs for current user
router.get('/user/me', protect, asyncHandler(async (req, res) => {
  const logs = await Log.find({ user: req.user._id })
    .sort({ timestamp: -1 })
    .limit(100);

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
}));

// Get action statistics (admin only)
router.get('/stats/actions', protect, adminOnly, asyncHandler(async (req, res) => {
  const stats = await Log.aggregate([
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const stateObj = {};
  stats.forEach(stat => {
    stateObj[stat._id] = stat.count;
  });

  res.status(200).json({
    success: true,
    data: stateObj
  });
}));

// Get user activity statistics (admin only)
router.get('/stats/users', protect, adminOnly, asyncHandler(async (req, res) => {
  const stats = await Log.aggregate([
    {
      $group: {
        _id: '$username',
        count: { $sum: 1 },
        lastAction: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 50
    }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
}));

// Export logs (admin only)
router.get('/export/csv', protect, adminOnly, asyncHandler(async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 });

  // Generate CSV
  let csv = 'Timestamp,Action,User,Role,Details,Resource\n';
  logs.forEach(log => {
    csv += `"${log.timestamp}","${log.action}","${log.username}","${log.userRole}","${log.details}","${log.resourceType}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
  res.send(csv);

  // Log the export
  await logActivity('EXPORT', `Admin ${req.user.username} exported logs`, req.user, 'system');
}));

// Clear logs (admin only - use with caution)
router.delete('/clear', protect, adminOnly, asyncHandler(async (req, res) => {
  const { confirmDelete } = req.body;

  if (!confirmDelete) {
    return res.status(400).json({ message: 'Please confirm deletion' });
  }

  const result = await Log.deleteMany({});

  await logActivity('DELETE', `Admin ${req.user.username} cleared all logs (${result.deletedCount} logs)`, req.user, 'system');

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} logs deleted`,
    deletedCount: result.deletedCount
  });
}));

export default router;
