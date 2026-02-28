// Admin Logging System
let logs = [];

export const logger = {
  log: (action, details) => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      action,
      details,
      user: 'admin'
    };
    logs.push(logEntry);
    console.log(`[ADMIN LOG] ${action}:`, details);
    return logEntry;
  },

  getLogs: () => [...logs],

  clearLogs: () => {
    logs = [];
    console.log('[ADMIN LOG] Logs cleared');
  },

  exportLogs: () => {
    return JSON.stringify(logs, null, 2);
  },

  getActionStats: () => {
    const stats = {};
    logs.forEach(log => {
      stats[log.action] = (stats[log.action] || 0) + 1;
    });
    return stats;
  }
};
