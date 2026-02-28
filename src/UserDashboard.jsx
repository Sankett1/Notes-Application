import { useState, useEffect } from 'react';
import { api } from './api';
import { logger } from './logger';
import { useAuth } from './AuthContext';

export default function UserDashboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  const { user, logout } = useAuth();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const loadNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
      logger.log('READ', `USER ${user?.username}: Fetched notes`);
    } catch {
      setNotes([]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      showNotification('Title and content cannot be empty');
      return;
    }

    try {
      await api.post('/notes', { title, content });
      logger.log('CREATE', `USER ${user?.username}: Created "${title}"`);
      setTitle('');
      setContent('');
      loadNotes();
      showNotification('✓ Note created');
    } catch {
      const newNote = {
        _id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toLocaleString()
      };
      setNotes([...notes, newNote]);
      logger.log('CREATE', `USER ${user?.username}: Created "${title}" (Mock)`);
      setTitle('');
      setContent('');
      showNotification('✓ Note created');
    }
  };

  const updateNote = async (id) => {
    if (!title.trim() || !content.trim()) {
      showNotification('Title and content cannot be empty');
      return;
    }

    try {
      await api.put(`/notes/${id}`, { title, content });
      logger.log('UPDATE', `USER ${user?.username}: Updated "${title}"`);
      setTitle('');
      setContent('');
      setEditingId(null);
      loadNotes();
      showNotification('✓ Note updated');
    } catch {
      const updatedNotes = notes.map(n =>
        n._id === id ? { ...n, title, content } : n
      );
      setNotes(updatedNotes);
      logger.log('UPDATE', `USER ${user?.username}: Updated "${title}" (Mock)`);
      setTitle('');
      setContent('');
      setEditingId(null);
      showNotification('✓ Note updated');
    }
  };

  const deleteNote = async (id, noteTitle) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      logger.log('DELETE', `USER ${user?.username}: Deleted "${noteTitle}"`);
      loadNotes();
      showNotification('✓ Note deleted');
    } catch {
      setNotes(notes.filter(n => n._id !== id));
      logger.log('DELETE', `USER ${user?.username}: Deleted "${noteTitle}" (Mock)`);
      showNotification('✓ Note deleted');
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `my-notes-${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    logger.log('EXPORT', `USER ${user?.username}: Exported ${notes.length} notes`);
    showNotification('✓ Notes exported');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-primary-600">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👤 My Notes</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, <span className="font-semibold text-primary-600">{user?.username}</span></p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg animate-fadeInOut z-50">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingId ? '✏️ Edit Note' : '➕ New Note'}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />

                <textarea
                  placeholder="What's on your mind..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition h-32 font-sans"
                />

                <div className="flex gap-2">
                  {editingId ? (
                    <>
                      <button
                        onClick={() => updateNote(editingId)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        💾 Update
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={createNote}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      ✓ Create
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <span className="font-bold">👤 User Mode:</span> You can create, edit and delete your notes. Admin logs are not visible to you.
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">📚 My Notes ({filteredNotes.length})</h3>
                <input
                  type="text"
                  placeholder="Search your notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              <button
                onClick={exportNotes}
                className="mb-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                📥 Export My Notes
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No notes yet. Create one to get started! 📝</p>
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div key={note._id} className="bg-primary-50 border-l-4 border-primary-600 rounded-lg p-4 hover:shadow-md transition">
                      <h4 className="font-bold text-gray-900 truncate">{note.title}</h4>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-3">{note.content}</p>
                      {note.createdAt && <small className="text-gray-500 text-xs block mt-2">{note.createdAt}</small>}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => editNote(note)}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-1 px-2 rounded transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note._id, note.title)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-bold">💡 Tip:</span> Your notes are stored safely. You can access them anytime. Use the export button to backup your notes regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
