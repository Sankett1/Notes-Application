import { useState } from 'react';
import { logger } from './logger';

function AdminLogs() {
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

  return (
    <div style={styles.adminContainer}>
      <button 
        onClick={() => setShowLogs(!showLogs)}
        style={styles.adminButton}
      >
        {showLogs ? '▼' : '▶'} Admin Logs ({allLogs.length})
      </button>

      {showLogs && (
        <div style={styles.logsPanel}>
          <div style={styles.statsArea}>
            <h4>Action Statistics</h4>
            <div style={styles.statsGrid}>
              {Object.entries(stats).map(([action, count]) => (
                <div key={action} style={styles.statItem}>
                  <strong>{action}:</strong> {count}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label>Filter by action: </label>
            <select 
              value={filterAction} 
              onChange={e => setFilterAction(e.target.value)}
              style={styles.select}
            >
              <option value="">All Actions</option>
              {Object.keys(stats).map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div style={styles.logsContent}>
            {filteredLogs.length === 0 ? (
              <p>No logs found</p>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} style={styles.logEntry}>
                  <span style={styles.timestamp}>{log.timestamp}</span>
                  <span style={styles.action}>[{log.action}]</span>
                  <span>{log.details}</span>
                </div>
              ))
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={handleExportLogs} style={styles.exportBtn}>📥 Export Logs</button>
            <button onClick={handleClearLogs} style={styles.clearBtn}>🗑️ Clear Logs</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  adminContainer: {
    marginTop: '20px',
    borderTop: '2px solid #ddd',
    paddingTop: '15px'
  },
  adminButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  logsPanel: {
    marginTop: '10px',
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  statsArea: {
    marginBottom: '15px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '10px'
  },
  statItem: {
    padding: '8px',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    borderLeft: '4px solid #2196F3'
  },
  select: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginLeft: '10px'
  },
  logsContent: {
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0',
    border: '1px solid #ddd'
  },
  logEntry: {
    padding: '8px',
    borderBottom: '1px solid #eee',
    fontSize: '12px',
    fontFamily: 'monospace'
  },
  timestamp: {
    color: '#999',
    marginRight: '10px'
  },
  action: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  exportBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  clearBtn: {
    backgroundColor: '#ffc107',
    color: '#333',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default AdminLogs;
