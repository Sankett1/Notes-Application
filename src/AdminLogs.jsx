import { useState } from 'react';
import { logger } from './logger';

function AdminLogs({ isAdmin = true }) {
  const [showLogs, setShowLogs] = useState(false);
  const [filterAction, setFilterAction] = useState('');

  const handleExportLogs = () => {
    const logsText = logger.exportLogs();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logsText));
    element.setAttribute('download', `admin-logs-${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      logger.clearLogs();
      setShowLogs(false);
    }
  };

  const allLogs = logger.getLogs();
  const stats = logger.getActionStats();
  const filteredLogs = filterAction 
    ? allLogs.filter(log => log.action === filterAction)
    : allLogs;

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => setShowLogs(!showLogs)}
        className="w-full bg-admin-600 hover:bg-admin-700 text-white font-bold py-4 px-6 text-left flex justify-between items-center transition"
      >
        <span>{showLogs ? '▼' : '▶'} 🔍 Admin Logs ({allLogs.length})</span>
      </button>

      {showLogs && (
        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Action Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(stats).length === 0 ? (
                <p className="text-gray-500 col-span-full">No actions logged yet</p>
              ) : (
                Object.entries(stats).map(([action, count]) => (
                  <div key={action} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="font-bold text-blue-900">{count}</div>
                    <div className="text-xs text-blue-700 mt-1">{action}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Filter by Action:</label>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent bg-white"
            >
              <option value="">All Actions</option>
              {Object.keys(stats).map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* Logs */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">📋 Log Details</h4>
            <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No logs found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredLogs.map((log, idx) => (
                    <div key={idx} className="p-3 hover:bg-gray-100 transition font-mono text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-600">{log.timestamp}</span>
                        <span className="px-2 py-1 bg-blue-200 text-blue-900 rounded text-xs font-bold">
                          {log.action}
                        </span>
                      </div>
                      <div className="text-gray-700 mt-1 break-words">
                        {log.details}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleExportLogs}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              📥 Export Logs
            </button>
            <button
              onClick={handleClearLogs}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              🗑️ Clear Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;
