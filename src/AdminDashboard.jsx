import { useState, useEffect } from 'react';
import { api } from './api';
import { logger } from './logger';
import AdminLogs from './AdminLogs';
import { useAuth } from './AuthContext';

export default function AdminDashboard() {
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
      logger.log('READ', `ADMIN: Fetched ${res.data.length} notes`);
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
      logger.log('CREATE', `ADMIN ${user?.username}: Note created - "${title}"`);
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
      logger.log('CREATE', `ADMIN ${user?.username}: Note created - "${title}" (Mock)`);
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
      logger.log('UPDATE', `ADMIN ${user?.username}: Updated note "${title}"`);
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
      logger.log('UPDATE', `ADMIN ${user?.username}: Updated note "${title}" (Mock)`);
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
      logger.log('DELETE', `ADMIN ${user?.username}: Deleted "${noteTitle}"`);
      loadNotes();
      showNotification('✓ Note deleted');
    } catch {
      setNotes(notes.filter(n => n._id !== id));
      logger.log('DELETE', `ADMIN ${user?.username}: Deleted "${noteTitle}" (Mock)`);
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
    element.setAttribute('download', `notes-${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    logger.log('EXPORT', `ADMIN ${user?.username}: Exported ${notes.length} notes`);
    showNotification('✓ Notes exported');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-admin-600">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔐 Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Logged in as: <span className="font-semibold text-admin-600">{user?.username}</span></p>
            </div>
            <button
              onClick={logout}
              className="bg-admin-600 hover:bg-admin-700 text-white font-bold py-2 px-4 rounded-lg transition"
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
                {editingId ? '✏️ Edit Note' : '➕ Create Note'}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition"
                />

                <textarea
                  placeholder="Note content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent transition h-32 font-sans"
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
            </div>
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editingId ? '([🔒 Admin Only]' : '📚 Notes'}({filteredNotes.length})</h3>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-600 focus:border-transparent"
                />
              </div>

              <button
                onClick={exportNotes}
                className="mb-6 bg-admin-600 hover:bg-admin-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                📥 Export Notes
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No notes found</p>
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div key={note._id} className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{note.title}</h4>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-3">{note.content}</p>
                      {note.createdAt && <small className="text-gray-500 text-xs block mt-2">{note.createdAt}</small>}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => editNote(note)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note._id, note.title)}
                          className="flex-1 bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold py-1 px-2 rounded transition"
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
        </div>

        {/* Admin Logs */}
        <div className="mt-8">
          <AdminLogs isAdmin={true} />
        </div>
      </div>
    </div>
  );
}
