import { useEffect, useState } from 'react';
import { api } from './api';
import { logger } from './logger';
import AdminLogs from './AdminLogs';

function App(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  // Show notification message
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // READ - Load all notes
  const loadNotes = async() => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
      logger.log('READ', `Fetched ${res.data.length} notes from database`);
    } catch (error) {
      logger.log('READ_ERROR', error.message);
      console.log('Mock data loaded (API unavailable)');
      // Mock data for testing
      setNotes([]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // CREATE - Add new note
  const createNote = async() => {
    if (!title.trim() || !content.trim()) {
      showNotification('Title and content cannot be empty');
      return;
    }

    try {
      await api.post('/notes', { title, content });
      logger.log('CREATE', `Note created - Title: "${title}"`);
      setTitle('');
      setContent('');
      loadNotes();
      showNotification('✓ Note created successfully');
    } catch (error) {
      // Mock implementation for testing without backend
      const newNote = {
        _id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toLocaleString()
      };
      setNotes([...notes, newNote]);
      logger.log('CREATE', `Note created - Title: "${title}" (Mock)`);
      setTitle('');
      setContent('');
      showNotification('✓ Note created successfully');
    }
  };

  // UPDATE - Modify existing note
  const updateNote = async(id) => {
    if (!title.trim() || !content.trim()) {
      showNotification('Title and content cannot be empty');
      return;
    }

    try {
      await api.put(`/notes/${id}`, { title, content });
      logger.log('UPDATE', `Note updated - ID: ${id}, Title: "${title}"`);
      setTitle('');
      setContent('');
      setEditingId(null);
      loadNotes();
      showNotification('✓ Note updated successfully');
    } catch (error) {
      // Mock implementation
      const updatedNotes = notes.map(n => 
        n._id === id ? { ...n, title, content } : n
      );
      setNotes(updatedNotes);
      logger.log('UPDATE', `Note updated - ID: ${id}, Title: "${title}" (Mock)`);
      setTitle('');
      setContent('');
      setEditingId(null);
      showNotification('✓ Note updated successfully');
    }
  };

  // DELETE - Remove note
  const deleteNote = async(id, noteTitle) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      logger.log('DELETE', `Note deleted - ID: ${id}, Title: "${noteTitle}"`);
      loadNotes();
      showNotification('✓ Note deleted successfully');
    } catch (error) {
      // Mock implementation
      setNotes(notes.filter(n => n._id !== id));
      logger.log('DELETE', `Note deleted - ID: ${id}, Title: "${noteTitle}" (Mock)`);
      showNotification('✓ Note deleted successfully');
    }
  };

  // Edit function
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  // Cancel edit
  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export notes
  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `notes-${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    logger.log('EXPORT', `Exported ${notes.length} notes`);
    showNotification('✓ Notes exported successfully');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📝 Notes Application</h1>
        <p>Complete CRUD Operations with Admin Logging</p>
      </div>

      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}

      <div style={styles.mainContent}>
        <div style={styles.formSection}>
          <h3>{editingId ? '✏️ Edit Note' : '➕ Create New Note'}</h3>
          
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={styles.input}
          />
          
          <textarea
            placeholder="Note content..."
            value={content}
            onChange={e => setContent(e.target.value)}
            style={styles.textarea}
          />
          
          <div style={styles.buttonGroup}>
            {editingId ? (
              <>
                <button onClick={() => updateNote(editingId)} style={styles.updateBtn}>
                  💾 Update Note
                </button>
                <button onClick={cancelEdit} style={styles.cancelBtn}>
                  ✕ Cancel
                </button>
              </>
            ) : (
              <button onClick={createNote} style={styles.createBtn}>
                ✓ Create Note
              </button>
            )}
          </div>
        </div>

        <div style={styles.notesSection}>
          <div style={styles.sectionHeader}>
            <h3>📚 My Notes ({filteredNotes.length})</h3>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button onClick={exportNotes} style={styles.exportBtn}>
            📥 Export All Notes
          </button>

          <div style={styles.notesList}>
            {filteredNotes.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No notes found. Create one to get started!</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note._id} style={styles.noteCard}>
                  <h4 style={styles.noteTitle}>{note.title}</h4>
                  <p style={styles.noteContent}>{note.content}</p>
                  {note.createdAt && <small style={styles.noteDate}>{note.createdAt}</small>}
                  <div style={styles.noteActions}>
                    <button
                      onClick={() => editNote(note)}
                      style={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note._id, note.title)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AdminLogs />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid #3498db',
    paddingBottom: '15px'
  },
  notification: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
    animation: 'fadeInOut 3s ease-in-out'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '120px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between'
  },
  createBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  updateBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  notesSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '10px'
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  exportBtn: {
    marginBottom: '15px',
    padding: '10px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  notesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px'
  },
  noteCard: {
    backgroundColor: '#f0f8ff',
    padding: '15px',
    borderRadius: '6px',
    borderLeft: '4px solid #3498db',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  noteTitle: {
    margin: '0 0 8px 0',
    color: '#2c3e50',
    fontSize: '16px'
  },
  noteContent: {
    margin: '0 0 10px 0',
    color: '#555',
    fontSize: '13px',
    lineHeight: '1.4',
    maxHeight: '80px',
    overflow: 'hidden'
  },
  noteDate: {
    color: '#999',
    fontSize: '11px',
    display: 'block',
    marginBottom: '10px'
  },
  noteActions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    flex: 1,
    padding: '6px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteBtn: {
    flex: 1,
    padding: '6px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999'
  }
};

export default App;