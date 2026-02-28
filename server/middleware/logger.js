import { Log } from '../models/index.js';

export const logActivity = async (action, details, user, resourceType = 'note', resourceId = null) => {
  try {
    const logEntry = new Log({
      action,
      details,
      user: user._id,
      username: user.username,
      userRole: user.role,
      resourceType,
      resourceId,
      ipAddress: null // Can be extracted from request if needed
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error('Error saving log:', error);
    return null;
  }
};

export const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
